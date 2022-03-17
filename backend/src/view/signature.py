import strawberry


@strawberry.input
class InputSignature:
    v: str
    r: str
    s: str


@strawberry.type
class Signature:
    v: str
    r: str
    s: str
