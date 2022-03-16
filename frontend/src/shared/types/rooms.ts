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

interface IUpdateRoomRequest extends IRoom {
	id: number;
}

interface IRoom {
	internalName: string;
	area: number;
	location: string
	contractAddress: string | null;
}

export type {
	ICreateRoomRequest,
	ICreateRoomResponse,
	IGetRoomRequest, 
	IGetRoomResponse,
	IUpdateRoomRequest,
};
