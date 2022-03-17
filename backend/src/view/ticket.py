import strawberry

from src.view.room import Room
from src.view.signature import Signature, InputSignature
from src.view.utils import Wei, Datetime, Nonce, InputNonce, InputDatetime, InputWei


@strawberry.type
class Ticket:
    id: strawberry.ID
    room: Room
    value: Wei
    deadline: Datetime
    nonce: Nonce
    cashier_signature: Signature



@strawberry.input
class InputTicket:
    room: strawberry.ID
    value: InputWei
    deadline: InputDatetime
    nonce: InputNonce
    cashier_signature: InputSignature
