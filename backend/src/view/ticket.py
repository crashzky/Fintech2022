import strawberry

from src.storage import db
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

    @classmethod
    def get_by_id(cls, id: str):
        db.execute(
            """
            SELECT 
                id,
                room,
                value,
                deadline,
                nonce,
                cashier_sig_v,
                cashier_sig_r,
                cashier_sig_s
            FROM ticket
            WHERE id = ?
            """, [id]
        )
        db_ticket = db.fetchone()
        return Ticket(
            id=db_ticket["id"],
            room=Room.get_by_id(id=db_ticket["room"]),
            value=Wei(wei=db_ticket["value"]),
            deadline=db_ticket["deadline"],
            nonce=Nonce(value=db_ticket["nonce"]),
            cashier_signature=Signature(
                v=db_ticket["cashier_sig_v"],
                r=db_ticket["cashier_sig_r"],
                s=db_ticket["cashier_sig_s"],
            )
        )




@strawberry.input
class InputTicket:
    room: strawberry.ID
    value: InputWei
    deadline: InputDatetime
    nonce: InputNonce
    cashier_signature: InputSignature
