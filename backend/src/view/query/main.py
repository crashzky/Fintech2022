import typing

import strawberry
import strawberry.types

from src.env import LANDLORD_ADDRESS
from src.exceptions import BadRequest
from src.storage import db
from src.view.auth import Authentication
from src.view.room import Room
from src.view.ticket import Ticket


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
    def rooms(self, info: strawberry.types.Info) -> typing.List[Room]:
        cookies = info.context["request"].cookies
        try:
            address = cookies["access_token_cookie"][6:]
        except KeyError:
            raise BadRequest("Authentication required")
        if address == LANDLORD_ADDRESS:
            db.execute(
                """
                SELECT id, internal_name, area, location, contract_address, public_name
                FROM room
                """
            )
            rooms = db.fetchall()
            rooms = [Room(**room) for room in rooms]
        else:
            db.execute(
                """
                SELECT id, internal_name, area, location, contract_address, public_name
                FROM room
                """
            )
            rooms = db.fetchall()
            rooms = []
        return rooms

    @strawberry.field
    def room(self, id: strawberry.ID) -> Room:
        return Room.get_by_id(id)

    def ticket(self, id: strawberry.ID) -> Ticket:
        pass
