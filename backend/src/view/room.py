import typing

import strawberry


@strawberry.type
class Room:
    id: strawberry.ID
    internal_name: str
    area: float
    location: str

    contract_address: typing.Optional[str] = None
    public_name: typing.Optional[str] = None


@strawberry.input
class InputRoom:
    internal_name: str
    area: float
    location: str
