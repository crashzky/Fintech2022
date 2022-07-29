from typing import Optional
import strawberry as stb
from typs import Nonce, Wei, engine, Session, AddrCook, get_contract, select, InputSignature, l, Authentication, LANDLORD_ADDRESS, Room, InputRoom, RoomModel, get_auth_user, get_room, DEBUG, is_contr_ex, InputTicket, Ticket, TicketModel, Datetime, ticket_to_model, model_to_ticket
from os import urandom
from strawberry.types import Info
from web3.auto import w3
from eth_account.messages import encode_defunct
from utils import from_sign, to_sign
import dateutil.parser
from datetime import datetime
import time


def hash(): return urandom(4).hex()


def get_cook(addr):
	cook = hash()
	return f'Click Sign to authenticate\n\nYour address:\n{addr}\n\nNonce:\n{cook}', cook


@stb.type
class Mutation:
	@stb.mutation
	def createTicket(self, ticket: InputTicket, info: Info) -> Ticket:
		token = info.context["request"].cookies.get('token')
		try:
			wei = int(ticket.value.wei)
		except:
			raise Exception('Value must be an integer')
		if wei <= 0:
			raise Exception('Value must be greater than zero')
		try:
			date = dateutil.parser.isoparse(
			ticket.deadline.datetime).replace(tzinfo=None)
		except ValueError:
			raise Exception('Invalid deadline date format')
		if date < datetime.now():
			raise Exception('The operation is outdated')
		deadline = int(time.mktime(date.timetuple()))
		nonce = int(ticket.nonce.value)
		value = int(ticket.value.wei)
		sign = ticket.cashierSignature
		try:
			int(sign.v, 16)
			int(sign.s, 16)
			int(sign.r, 16)
		except ValueError:
			raise Exception('Invalid cashier signature')
		mod = ticket_to_model(ticket)
		with Session(engine) as session:
			room = get_room(session, mod.room_id)
			if room.contractAddress is None:
				raise Exception('Room does not have a contract')
			user = get_auth_user(session, token, check_admin=False)
			l(f"steall: {ticket, room, user}")
			# l(f"timestamp1: {time.mktime(date.timetuple())}")
			contract = get_contract(room.contractAddress)
			f = contract.get_function_by_signature(
 				"getTicketSigner(uint256,uint256,uint256,uint8,uint256,uint256)"
			)
			if not contract.functions.isCashier(user.address).call():
				raise Exception("This method is available only for the cashiers")
			a = f(deadline, nonce, value, int(sign.v, 16), int(sign.r, 16), int(sign.s, 16)).call()
			if a != user.address:
				raise Exception("Unknown cashier")
			if contract.functions.getCashierNonce(user.address).call() != nonce:
				raise Exception("Invalid nonce")
			# l(f"logg: {deadline, nonce, value, int(sign.v, 16), sign.r, sign.s}")
			# l(f"logg: {f(deadline, nonce, value, int(sign.v, 16), int(sign.r, 16), int(sign.s, 16)).call()}")
			session.add(mod)
			session.commit()
			res = model_to_ticket(room, mod)
		return res

	@stb.mutation
	def createRoom(self, room: InputRoom, info: Info) -> Room:
		token = info.context["request"].cookies.get('token')
		area = room.area
		if area <= 0:
			raise Exception('The room area must be greater than zero')
		room_mod = RoomModel(internalName=room.internalName, area=area, location=room.location)
		with Session(engine) as session:
			user = get_auth_user(session, token)
			session.add(room_mod)
			session.commit()
			l(f"mutation createRoom({room}) -> room={room_mod}")
			room = Room.from_pydantic(room_mod)
		return room

	@stb.mutation
	def removeRoom(self, id: stb.ID, info: Info) -> Room:
		token = info.context["request"].cookies.get('token')
		with Session(engine) as session:
			user = get_auth_user(session, token)
			room_mod = get_room(session, id)
			addr = room_mod.contractAddress
			if addr is not None:
				try:
					contract = get_contract(addr)
					isRented = contract.functions.isRented().call()
					isPaid = contract.functions.isPaid().call()
					isExpired = contract.functions.isExpired().call()
				except:
					pass
			else:
				if isRented and isPaid and not isExpired:
					raise Exception("Room has rented contract in progress")
			session.delete(room_mod)
			session.commit()
		return room_mod

	@stb.mutation
	def editRoom(self, id: stb.ID, room: InputRoom, info: Info) -> Room:
		token = info.context["request"].cookies.get('token')
		area = room.area
		if area <= 0:
			raise Exception('The room area must be greater than zero')
		with Session(engine) as session:
			user = get_auth_user(session, token)
			room_mod = get_room(session, id)
			room_mod.location = room.location
			room_mod.area = area
			room_mod.internalName = room.internalName
			session.add(room_mod)
			session.commit()
			l(f"mutation createRoom({room}) -> room={room_mod}")
			room = Room.from_pydantic(room_mod)
		return room

	@stb.mutation
	def setRoomPublicName(self, id: stb.ID, info: Info, publicName: Optional[str] = None) -> Room:
		token = info.context["request"].cookies.get('token')
		with Session(engine) as session:
			user = get_auth_user(session, token, False)
			room_mod = get_room(session, id)
			if room_mod.contractAddress is None:
				# pass
				raise Exception("This room is not rented by you")
			if get_contract(room_mod.contractAddress).functions.getTenant().call() != user.address:
				# pass
				raise Exception("This room is not rented by you")
			room_mod.publicName = publicName
			session.add(room_mod)
			session.commit()
			l(f"mutation setRoomPublicName(id={id}, publicName={publicName}) -> room={room_mod}")
			room = Room.from_pydantic(room_mod)
		l(f"{room}")
		return room

	@stb.mutation
	def setRoomContractAddress(self, id: stb.ID, info: Info, contractAddress: Optional[str] = None) -> Room:
		if contractAddress is not None:
			is_contr_ex(contractAddress)
			token = info.context["request"].cookies.get('token')
			with Session(engine) as session:
				user = get_auth_user(session, token)
				room_mod = get_room(session, id)
				room_mod.contractAddress = contractAddress
				session.add(room_mod)
				session.commit()
				l(f"mutation setRoomContractAddress(id={id}, contractAddress={contractAddress}) -> room={room_mod}")
				room = Room.from_pydantic(room_mod)
			l(f"{room}")
			return room

	@stb.mutation
	def requestAuthentication(self, address: str) -> str:
		l(f'mutation requestAuthentication({address})')
		msg, cook = get_cook(address)
		with Session(engine) as session:
			st = select(AddrCook).where(AddrCook.address == address)
			results = session.exec(st).one_or_none()

			if results is None:
				struc = AddrCook(cook=cook, address=address, msg=msg)
				session.add(struc)
				session.commit()
				return msg
			results.cook = cook
			results.msg = msg
			results.is_auth = False
			results.token = ''
			session.add(results)
			session.commit()
		return msg

	@stb.mutation
	def authenticate(self, address: str, signedMessage: InputSignature, info: Info) -> Authentication:
		isLandlord = address == LANDLORD_ADDRESS
		st = select(AddrCook).where(AddrCook.address == address)
		with Session(engine) as session:
			result = session.exec(st).one_or_none()
			l(f'mutation authenticate(addr={address}, sign={signedMessage}), result_select={result}')
			if result is None:
				raise Exception("Authentication failed")
			if result.is_auth == True:
				raise Exception("Authentication failed")
			msg = encode_defunct(text=result.msg)
			try:
				sign = to_sign(signedMessage)
				addr2 = w3.eth.account.recover_message(msg, signature=sign)
			except:
				raise Exception("Authentication failed")
			if DEBUG:
				eq = addr2.lower() == '0xe3f686A61AA1673a3d128d6EbfD461aE0780DeAc'.lower()
			else:
				eq = (addr2.lower() == address.lower())
			if not eq:
				l(f"ADDRESS NOT EQUAL: {addr2} != {address}")
				raise Exception("Authentication failed")
			result.is_auth = True
			result.token = hash()
			session.add(result)
			session.commit()
			session.refresh(result)
			session.expunge(result)
		info.context["response"].set_cookie(key="addr", value=address)
		info.context["response"].set_cookie(key="token", value=result.token)

		return Authentication(address=address, isLandlord=isLandlord)