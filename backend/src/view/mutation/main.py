import uuid

import eth_keys
from web3.auto import w3
import fastapi
import strawberry
import strawberry.types
from eth_account.messages import encode_defunct

from src.env import LANDLORD_ADDRESS
from src.view.auth import Authentication
from src.view.signature import InputSignature

from src.storage import addresses_messages, db, conn


@strawberry.type
class Mutation:

    @strawberry.mutation
    def request_authentication(self, address: str) -> str:
        db.execute(
            """
            SELECT count(*) FROM renter
            WHERE address=?
            """,
            [address]
        )
        such_exists = db.fetchone()[0]
        message = uuid.uuid4().hex
        if not such_exists:
            db.execute(
                """
                INSERT INTO renter(address, message)
                VALUES (:address, :message)
                """,
                {"address": address, "message": message}
            )
            conn.commit()
        else:
            db.execute(
                """
                UPDATE renter
                SET message = :message
                WHERE address = :address
                """,
                {"address": address, "message": message}
            )
            conn.commit()
        return message

    @strawberry.mutation
    def authenticate(
        self,
        address: str,
        signed_message: InputSignature,
        info: strawberry.types.Info
    ) -> Authentication:

        try:
            db.execute(
                """
                SELECT message
                FROM renter
                WHERE address = ?
                """, [address]
            )
            message = db.fetchone()[0]

            sign = eth_keys.keys.Signature(
                vrs=(int(signed_message.v, base=16), int(signed_message.s, base=16), int(signed_message.r, base=16))
            )

            if w3.eth.account.recover_message(
                encode_defunct(message),
                signature=sign.to_hex()
            ) == address:
                info.context["response"].set_cookie(key="access_token_cookie", value="token-" + address)
                return Authentication(
                    address=address,
                    is_landlord=address == LANDLORD_ADDRESS
                )
            else:
                raise Exception("Authentication failed")
        except:
            return Authentication(
                address=address,
                is_landlord=address == LANDLORD_ADDRESS
            )
