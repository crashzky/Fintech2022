import typing

import strawberry
import strawberry.types

from src.env import LANDLORD_ADDRESS
from src.storage import db
from src.view.auth import Authentication


@strawberry.type
class Query:
    @strawberry.field
    def authentication(self, info: strawberry.types.Info) -> typing.Optional[Authentication]:
        try:
            address = info.context["request"].cookies["address"]
        except KeyError:
            return None
        else:
            return Authentication(
                address=address,
                is_landlord=address == LANDLORD_ADDRESS
            )

