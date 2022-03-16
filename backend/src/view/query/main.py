import typing

import strawberry
import strawberry.types

from src.env import LANDLORD_ADDRESS
from src.storage import db
from src.view.auth import Authentication
from src.view.room import Room


@strawberry.type
class Query:
    @strawberry.field
    def authentication(
        self, info: strawberry.types.Info
    ) -> typing.Optional[Authentication]:
        try:
            address = info.context["request"].cookies["access_token_cookie"][
                6:
            ]
        except KeyError:
            return None
        else:
            return Authentication(
                address=address, is_landlord=address == LANDLORD_ADDRESS
            )

    @strawberry.field
    def rooms(self) -> typing.List[Room]:
        pass

    @strawberry.field
    def room(self, id: strawberry.ID) -> Room:
        db.execute(
            """
            SELECT id, internal_name, area, location
            FROM room
            WHERE id = ?
            """, [id]
        )
        return Room(**db.fetchone())
