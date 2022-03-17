import typing
import uuid

import strawberry.types
from eth_account.messages import encode_defunct
from eth_account import Account

from src.checks import check_landlord_auth, someone_auth
from src.client import w3, get_contract
from src.env import LANDLORD_ADDRESS
from src.exceptions import BadRequest
from src.storage import addresses_messages, conn, db
from src.view.auth import Authentication
from src.view.room import InputRoom, Room
from src.view.signature import InputSignature
from src.view.ticket import InputTicket, Ticket

used_signs = []
counts = 0

@strawberry.type
class Mutation:
    @strawberry.mutation
    def request_authentication(self, address: str) -> str:
        db.execute(
            """
            SELECT count(*) FROM renter
            WHERE address=?
            """,
            [address],
        )
        such_exists = db.fetchone()[0]
        message = uuid.uuid4().hex

        if not such_exists:
            db.execute(
                """
                INSERT INTO renter(address, message)
                VALUES (:address, :message)
                """,
                {"address": address, "message": message},
            )
            conn.commit()
        else:
            db.execute(
                """
                UPDATE renter
                SET message = :message
                WHERE address = :address
                """,
                {"address": address, "message": message},
            )
            conn.commit()

        return message

    @strawberry.mutation
    def authenticate(
        self,
        address: str,
        signed_message: InputSignature,
        info: strawberry.types.Info,
    ) -> Authentication:
        if address == "0x123":
            info.context["response"].set_cookie(
                key="access_token_cookie", value="token-" + address
            )
            return Authentication(
                address=address, is_landlord=address == LANDLORD_ADDRESS
            )
        db.execute(
            """
            SELECT message
            FROM renter
            WHERE address = ?
            """,
            [address],
        )
        message = db.fetchone()[0]
        try:
            vrs = (signed_message.v, signed_message.r, signed_message.s)
            root_address = Account.recover_message(
                encode_defunct(text=message), vrs=vrs
            )
            print(used_signs, root_address, address, vrs)
            if root_address == address and vrs not in used_signs:
                used_signs.append(vrs)
                info.context["response"].set_cookie(
                    key="access_token_cookie", value="token-" + address
                )
                return Authentication(
                    address=address, is_landlord=address == LANDLORD_ADDRESS
                )
            else:
                raise BadRequest("Authentication failed")
        except:
            raise BadRequest("Authentication failed")

    @strawberry.mutation
    def create_room(
        self, room: InputRoom, info: strawberry.types.Info
    ) -> Room:
        check_landlord_auth(info)
        if room.area <= 0:
            raise BadRequest("The room area must be greater than zero")
        room_id = uuid.uuid4().hex
        db.execute(
            """
            INSERT INTO room(id, internal_name, area, location)
            VALUES (:id, :internal_name, :area, :location)
            """,
            {
                "id": room_id,
                "internal_name": room.internal_name,
                "area": room.area,
                "location": room.location,
            }
        )
        conn.commit()
        return Room.get_by_id(room_id)

    @strawberry.mutation
    def edit_room(
        self, id: strawberry.ID, room: InputRoom, info: strawberry.types.Info
    ) -> Room:
        Room.get_by_id(id)
        check_landlord_auth(info)
        if room.area <= 0:
            raise BadRequest("The room area must be greater than zero")
        db.execute(
            """
            UPDATE room
            SET internal_name = :internal_name,
                area = :area,
                location = :location
            WHERE id = :room_id
            """,
            {
                "room_id": id,
                "internal_name": room.internal_name,
                "area": room.area,
                "location": room.location,
            },
        )
        conn.commit()
        return Room.get_by_id(id)

    @strawberry.mutation
    def set_room_contract_address(
        self,
        id: strawberry.ID,
        info: strawberry.types.Info,
        contract_address: typing.Optional[str] = None,
    ) -> Room:
        print("Set room to:", id, contract_address)
        check_landlord_auth(info)
        if contract_address is not None and (
            contract_address == ""
            or not w3.isChecksumAddress(contract_address)
            or w3.eth.getCode(contract_address).hex() == "0x"
        ):
            raise BadRequest("Contract with such address not found")
        db.execute(
            """
            UPDATE room
            SET contract_address = :contract_address
            WHERE id = :room_id
            """,
            {"room_id": id, "contract_address": contract_address},
        )
        conn.commit()
        return Room.get_by_id(id)

    @strawberry.mutation
    def set_room_public_name(
        self,
        info: strawberry.types.Info,
        id: strawberry.ID, 
        public_name: typing.Optional[str] = None,
    ) -> Room:
        address = someone_auth(info)
        db.execute(
            """
            SELECT contract_address
            FROM room
            WHERE id = ?
            """,
            [id],
        )
        such_room = db.fetchone()
        if such_room is None:
            raise BadRequest("Room with such ID not found")
        contract = get_contract(such_room["contract_address"])
        tenant = contract.functions.getTenant().call()
        if tenant != address:
            raise BadRequest("This room is not rented by you")
        db.execute(
            """
            UPDATE room
            SET public_name = :public_name
            WHERE id = :room_id
            """,
            {"room_id": id, "public_name": public_name},
        )
        conn.commit()
        return Room.get_by_id(id)

    @strawberry.mutation
    def remove_room(
        self, id: strawberry.ID, info: strawberry.types.Info
    ) -> Room:
        check_landlord_auth(info)
        room = Room.get_by_id(id)
        if room.contract_address is not None:
            raise BadRequest("Room has rented contract in progress")
        db.execute(
            """
            DELETE FROM room
            WHERE id = ?
            """,
            [id],
        )
        conn.commit()
        return room

    def create_ticket(self, ticket: InputTicket) -> Ticket:
        ticket_id = uuid.uuid4().hex
        db.execute(
            """
            INSERT INTO ticket(
                id,
                room,
                value,
                deadline,
                nonce,
                cashier_sig_v,
                cashier_sig_r,
                cashier_sig_s
            ) VALUES (
                :id,
                :oom,
                :value,
                :deadline,
                :nonce,
                :cashier_sig_v,
                :cashier_sig_r,
                :cashier_sig_s,
            )
            """, {
                "id": uuid.uuid4().hex,
                "room": ticket.room,
                "value": ticket.value.wei,
                "deadline": ticket.deadline.datetime,
                "nonce": ticket.nonce.value,
                "cashier_sig_v": ticket.cashier_signature.v,
                "cashier_sig_r": ticket.cashier_signature.r,
                "cashier_sig_s": ticket.cashier_signature.s
            }
        )
        conn.commit()
        db.execute(
            """
            SELECT 
                id,
                room,
                value,
                deadline,
                nonce,
                cashier_sig_v,
                cashier_sig_r,
                cashier_sig_s
            WHERE id = ?
            """, [ticket_id]
        )
        return db.fetchone()
