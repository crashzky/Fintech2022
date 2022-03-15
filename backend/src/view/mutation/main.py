import uuid

import strawberry

from src.view.auth import Authentication
from src.view.signature import InputSignature


@strawberry.type
class Mutation:

    @strawberry.field
    def request_authentication(self, address: str) -> str:
        return uuid.uuid4().hex

    @strawberry.field
    def authenticate(
        self,
        address: str,
        signed_message: InputSignature
    ) -> Authentication:
        pass
