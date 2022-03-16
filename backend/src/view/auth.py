import strawberry


@strawberry.type
class Authentication:
    address: str
    is_landlord: bool
