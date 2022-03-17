import strawberry
import datetime as std_datetime



@strawberry.input
class InputNonce:
    value: str


@strawberry.type
class Nonce:
    value: str


@strawberry.input
class InputDatetime:
    datetime: str

    def get(self) -> std_datetime.datetime:
        return std_datetime.datetime.fromisoformat(self.datetime)

@strawberry.type
class Datetime:
    datetime: str

    def get(self) -> std_datetime.datetime:
        return std_datetime.datetime.fromisoformat(self.datetime)

@strawberry.type
class Wei:
    wei: str


@strawberry.input
class InputWei:
    wei: str

