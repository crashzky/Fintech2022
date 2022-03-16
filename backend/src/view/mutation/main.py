import typing
import uuid

import eth_keys
import fastapi
import strawberry
import strawberry.types
from eth_account.messages import encode_defunct
from web3.auto import w3

from src.checks import check_landlord_auth
from src.env import LANDLORD_ADDRESS
from src.exceptions import BadRequest
from src.storage import addresses_messages, conn, db
from src.view.auth import Authentication
from src.view.room import InputRoom, Room
from src.view.signature import InputSignature


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
        db.execute(
            """
            SELECT message
            FROM renter
            WHERE address = ?
            """,
            [address],
        )
        message = db.fetchone()[0]

        real_v = 0
        if int(signed_message.v, base=16) == 28:
            real_v = 1
        sign = eth_keys.keys.Signature(
            vrs=(
                real_v,
                int(signed_message.r, base=16),
                int(signed_message.s, base=16),
            ),
        )
        if (
            w3.eth.account.recover_message(
                encode_defunct(text=message), signature=sign.to_hex()
            )
            == address
        ):
            info.context["response"].set_cookie(
                key="access_token_cookie", value="token-" + address
            )
            return Authentication(
                address=address, is_landlord=address == LANDLORD_ADDRESS
            )
        else:
            raise BadRequest("Authentication failed")

    @strawberry.mutation
    def create_room(self, room: InputRoom, info: strawberry.types.Info) -> Room:
        check_landlord_auth(info)
        if room.area <= 0:
            raise BadRequest("The room area must be greater than zero")
        room_id = uuid.uuid4().hex
        db.execute(
            """
            INSERT INTO room(id, internal_name, area, location)
            VALUES (:id, :internal_name, :area, :location)
            """, {
                "id": room_id,
                "internal_name": room.internal_name,
                "area": room.area,
                "location": room.location
            }
        )
        conn.commit()
        return Room.get_by_id(room_id)

    @strawberry.mutation
    def edit_room(self, id: strawberry.ID, room: InputRoom) -> Room:
        pass

    @strawberry.mutation
    def set_room_contract_address(
        self, id: strawberry.ID, contract_address: typing.Optional[str],
        info: strawberry.types.Info
    ) -> Room:
        check_landlord_auth(info)
        db.execute(
            """
            UPDATE room
            SET contract_address = :contract_address
            WHERE id = :room_id
            """, {
                "room_id": id,
                "contract_address": contract_address
            }
        )
        return Room.get_by_id(id)


    @strawberry.mutation
    def set_room_public_name(
        self, id: strawberry.ID, contract_address: typing.Optional[str]
    ) -> Room:
        pass

    @strawberry.mutation
    def remove_room(self, id: strawberry.ID) -> Room:
        pass
