import strawberry as stb
from typing import Optional
from typs import Authentication, RoomModel, Session, engine, get_contract, get_room, select, AddrCook, LANDLORD_ADDRESS, l, Room, get_auth_user, model_to_ticket, get_ticket, Ticket
from strawberry.types import Info


@stb.type
class Query:
	@stb.field
	def ticket(self, id: stb.ID, info: Info) -> Ticket:
		with Session(engine) as session:
			tick_mod = get_ticket(session, id)
			room = get_room(session,tick_mod.room_id)
			res = model_to_ticket(room, tick_mod)
		return res

	@stb.field
	def authentication(self, info: Info) -> Optional[Authentication]:
		addr = info.context["request"].cookies.get('addr')
		token = info.context["request"].cookies.get('token')
		l(f'query authentication(addr={addr}, token={token})')
		isLandlord = addr == LANDLORD_ADDRESS
		if addr is None or token in (None, ''):
			return None
		st = select(AddrCook).where(AddrCook.token == token)
		with Session(engine) as session:
			# print(session.exec(select(AddrCook).where(AddrCook.address == addr)).one_or_none())
			result = session.exec(st).one_or_none()
			if result is None:
				return None
			if not result.is_auth:
				return None
			return Authentication(address=result.address, isLandlord=isLandlord)

	@stb.field
	def room(self, id: stb.ID, info: Info) -> Room:
		with Session(engine) as session:
			room_mod = get_room(session, id)
			return room_mod

	@stb.field
	def rooms(self, info: Info) -> list[Room]:
		token = info.context["request"].cookies.get('token')
		with Session(engine) as session:
			privilege, user = get_user_privilege(session,token)
			if privilege == 2: # admin
				ls = [i[0] for i in session.execute(select(RoomModel)).all()]
				return ls
			if privilege == 1:
				ls = []
				for i in session.execute(select(RoomModel)).all():
					el = i[0]
					address = el.contractAddress
					if address is not None:
						contract = get_contract(address)
						if contract.functions.isRented().call():
							if contract.functions.getTenant().call() != user.address:
								continue
							ls.append(el)
			else:
				return []
		return ls


def get_user_privilege(session, token):
	if token in (None, ''):
		return 0, None
	st = select(AddrCook).where(AddrCook.token == token)
	user = session.exec(st).one_or_none()
	if user is None:
		return 0, None
	return 1+(user.address == LANDLORD_ADDRESS), user