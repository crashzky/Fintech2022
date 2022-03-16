from __future__ import annotations

import typing

import strawberry

from src.exceptions import BadRequest
from src.storage import db


@strawberry.type
class Room:
    id: strawberry.ID
    internal_name: str
    area: float
    location: str

    contract_address: typing.Optional[str] = None
    public_name: typing.Optional[str] = None

    @classmethod
    def get_by_id(cls, id: strawberry.ID | str) -> Room:
        db.execute(
            """
            SELECT id, internal_name, area, location, contract_address, public_name
            FROM room
            WHERE id = ?
            """,
            [id],
        )
        room = db.fetchone()
        if room is None:
            raise BadRequest("Room with such ID not found")
        return Room(**room)


@strawberry.input
class InputRoom:
    internal_name: str
    area: float
    location: str
