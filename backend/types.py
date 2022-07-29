from typing import Optional
import strawberry as stb
from sqlmodel import SQLModel, Field, create_engine, Session, select
import os
import logging
from web3 import Web3, HTTPProvider

with open("contracts/RentalAgreement.bin", "r") as f:
	bytecode = f.read()
with open("contracts/RentalAgreement.abi", "r") as f:
	abi = f.read()
		
DEBUG = False
if DEBUG:
	LANDLORD_ADDRESS = "0x2A6C5AeFb2ac393a38e67B35E8a748Da83a2F870"
else:
	RPC_URL = os.environ.get('RPC_URL')
	LANDLORD_ADDRESS = os.environ.get('LANDLORD_ADDRESS')
	ww3 = Web3(HTTPProvider(RPC_URL))

engine = create_engine("sqlite:///database.db", echo=True)
logger = logging.getLogger("execution")
logger.addHandler(logging.StreamHandler())
logger.setLevel("DEBUG")
def l(msg): return logger.debug("[DEBUG] "+msg)


def is_contr_ex(addr):
	if DEBUG:return None
	try:
		if not (ww3.isChecksumAddress(addr) and len(ww3.eth.get_code(addr)) > 0):
			raise Exception('Contract with such address not found')
	except:
		raise Exception('Contract with such address not found')


def get_contract(address):
	return ww3.eth.contract(address=address, abi=abi)


def get_auth_user(session, token, check_admin=True):
	if token in (None, ''):
		raise Exception('Authentication required')
	st = select(AddrCook).where(AddrCook.token == token)
	user = session.exec(st).one_or_none()
	if user is None:
		raise Exception('Authentication required')
	if check_admin:
		if user.address != LANDLORD_ADDRESS:
			raise Exception('This method is available only for the landlord')
	return user

def ticket_to_model(tick):
	mod = TicketModel(
		room_id=tick.room, # id
		nonce=tick.nonce.value,
		value=tick.value.wei,
		deadline=tick.deadline.datetime,
		cashierSignature=to_sign(tick.cashierSignature)
	)
	return mod
def model_to_ticket(room, mod):
	tick = Ticket(
		room=room,
		id=mod.id,
		nonce=Nonce(value=mod.nonce),
		value=Wei(wei=mod.value),
		deadline=Datetime(datetime=mod.deadline),
		cashierSignature=from_sign(mod.cashierSignature),
 	)
	return tick

def get_room(session, id):
	room = session.execute(select(RoomModel).where(RoomModel.id == id)).one_or_none()
	if room is None:
		raise Exception('Room with such ID not found')
	return room[0]

def get_ticket(session, id):
	room = session.execute(select(TicketModel).where(TicketModel.id == id)).one_or_none()
	if room is None:
		raise Exception('Ticket with such ID not found')
	return room[0]


class AddrCook(SQLModel, table=True):
	address: str = Field(primary_key=True)
	msg: str
	cook: str
	is_auth: bool = Field(default=False)
	token: str = Field(default='')	

@stb.input
class InputSignature:
	v: str
	r: str
	s: str
@stb.type
class Signature:
	v: str
	r: str
	s: str

@stb.type
class Wei:
	wei: str

@stb.input
class InputWei:
	wei: str

@stb.type
class Datetime:
	datetime: str

@stb.type
class Nonce:
	value: str

@stb.input
class InputNonce:
	value: str

@stb.input
class InputDatetime:
	datetime: str

@stb.input
class InputTicket:
	room: stb.ID
	nonce: InputNonce
	value: InputWei
	deadline: InputDatetime
	cashierSignature: InputSignature

@stb.type
class Ticket:
	id: stb.ID
	room: "Room"
	nonce: Nonce
	value: Wei
	deadline: Datetime
	cashierSignature: Signature

class TicketModel(SQLModel, table=True):
	id: Optional[int] = Field(primary_key=True, default=None)
	room_id: int
	nonce: str
	value: str
	deadline: str
	cashierSignature: str

@stb.type
class Authentication:
	address: str
	isLandlord: bool


class RoomModel(SQLModel, table=True):
	id: Optional[int] = Field(primary_key=True, default=None)
	internalName: str
	area: float
	location: str
	contractAddress: Optional[str] = None
	publicName: Optional[str] = None


@stb.experimental.pydantic.type(model=RoomModel, fields=['id', 'internalName', 'area', 'location', 'contractAddress', 'publicName'])
class Room:
	id: stb.ID


@stb.input
class InputRoom:
	internalName: str
	area: float
	location: str	

def to_32byte_hex(val):
	return val[2:].rjust(64, '0')

def to_sign(signedMessage):
	v = signedMessage.v[2:]
	sign = to_32byte_hex(signedMessage.r) + to_32byte_hex(signedMessage.s) + '0'*(2-len(v))+v
	return sign
def from_sign(sign): # only for my signs ! !! !!!!!
	v = '0x'+sign[-2:]
	r = sign[:64+2]
	s = '0x'+sign[64+2:130]
	return Signature(v,r,s)