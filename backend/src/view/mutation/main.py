import strawberry

from src.view.auth import Authentication
from src.view.signature import InputSignature


@strawberry.type
class Mutation:
    a: str

    def request_authentication(self, address: str) -> str:
        pass

    def authenticate(
        self,
        address: str,
        signed_message: InputSignature
    ) -> Authentication:
        pass
