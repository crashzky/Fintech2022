import strawberry


@strawberry.input
class InputSignature:
    v: str
    r: str
    s: str
