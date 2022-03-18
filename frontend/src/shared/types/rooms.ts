interface ICreateRoomRequest {
	internalName: string;
	area: number;
	location: string;
}

interface ICreateRoomResponse {
	data: {
		createRoom: {
			id: number;
			internalName: string;
			area: string;
			location: string;
		}
	}
}

interface IGetRoomRequest {
	id: string;
}

interface IGetRoomResponse {
	data: {
		room: IRoom;
	}
}

interface IGetRoomsResponse {
	data: {
		rooms: IRoom[];
	}
}

interface IUpdateRoomRequest {
	id: string;
	internalName: string;
	area: number;
	location: string
}

interface IRoom {
	id: string;
	internalName: string;
	area: number;
	location: string
	contractAddress: string | null;
	publicName: string | null;
}

interface IRoomPublicNameRequest {
	id: string;
	publicName: string | null;
}

interface IRoomPublicNameResponse {
	data: {
		setRoomPublicName: {
			id: string;
			publicName: string;
		}
	}
}

interface ISetRoomContractAddressRequest {
	id: string;
	contractAddress: string;
}

interface ISetRoomContractAddressResponse {
	data: {
		setRoomContractAddress: {
			id: string;
			contractAddress: string;
		}
	}
}

interface IRemoveRoomRequest {
	id: string;
}

interface IRemoveRoomResponse {
	data: {
		removeRoom: {
			id: string;
			internalName: string;
			area: number;
			location: string;
		}
	}
}

export type {
	ICreateRoomRequest,
	ICreateRoomResponse,
	IGetRoomRequest, 
	IGetRoomResponse,
	IUpdateRoomRequest,
	IGetRoomsResponse,
	IRoom,
	IRoomPublicNameRequest,
	IRoomPublicNameResponse,
	ISetRoomContractAddressRequest,
	ISetRoomContractAddressResponse,
	IRemoveRoomRequest,
	IRemoveRoomResponse,
};
