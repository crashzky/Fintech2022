import time
import typing

import strawberry
import strawberry.types

from src.checks import someone_auth
from src.client import get_contract
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
        address = someone_auth(info)
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
                WHERE contract_address IS NOT NULL
                """
            )

            db_rooms = db.fetchall()
            rooms = []
            for room in db_rooms:
                contract = get_contract(room["contract_address"])
                tenant = contract.functions.getTenant().call()
                is_rented = contract.functions.getRentedState().call()
                end_time = contract.functions.getRentEndTime().call()
                print("BC DATA:", tenant, is_rented, room)
                if tenant == address or time.time() >= end_time or not is_rented:
                    rooms.append(Room(**room))

        print("108-2 ROOMS:", rooms)
        return rooms

    @strawberry.field
    def room(self, id: strawberry.ID) -> Room:
        return Room.get_by_id(id)

    @strawberry.field
    def ticket(self, id: strawberry.ID) -> Ticket:
        return Ticket.get_by_id(id)
