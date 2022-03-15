import uuid

import fastapi
import strawberry
import strawberry.types

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
        such_exists = db.fetchone()
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
        info.context["response"].set_cookie(key="address", value=address)
        db.execute(
            """
            UPDATE renter
            SET signature_s = :signature_s, signature_r = :signature_r, signature_v = :signature_v
            WHERE address = :address
            """,
            {
                "signature_s": signed_message.s,
                "signature_r": signed_message.r,
                "signature_v": signed_message.v,
                "address": address
            }
        )
        conn.commit()
        return Authentication(
            address=address,
            is_landlord=address == LANDLORD_ADDRESS
        )
