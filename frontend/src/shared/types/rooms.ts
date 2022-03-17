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

interface IRoomPublicName {
	id: string;
	publicName: string;
}

export type {
	ICreateRoomRequest,
	ICreateRoomResponse,
	IGetRoomRequest, 
	IGetRoomResponse,
	IUpdateRoomRequest,
	IGetRoomsResponse,
	IRoom,
	IRoomPublicName,
};
