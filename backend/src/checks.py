import strawberry.types

from src.env import LANDLORD_ADDRESS
from src.exceptions import BadRequest


def check_landlord_auth(info: strawberry.types.Info) -> None:
    cookies = info.context["request"].cookies
    try:
        address = cookies["access_token_cookie"][6:]
    except KeyError:
        raise BadRequest("Authentication required")
    else:
        if address != LANDLORD_ADDRESS:
            raise BadRequest("This method is available only for the landlord")


def someone_auth(info: strawberry.types.Info) -> str:
    cookies = info.context["request"].cookies
    try:
        return cookies["access_token_cookie"][6:]
    except KeyError:
        raise BadRequest("Authentication required")
