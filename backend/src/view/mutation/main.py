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
        return uuid.uuid4().hex

    @strawberry.mutation
    def authenticate(
        self,
        address: str,
        signed_message: InputSignature,
        info: strawberry.types.Info
    ) -> Authentication:
        info.context["response"].set_cookie(key="access_token_cookie", value=address)
        return Authentication(
            address=address,
            is_landlord=address == LANDLORD_ADDRESS
        )
