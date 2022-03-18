import axios from 'axios';
import { API_URL } from '../consts/api';
import { ICreateRoomRequest, ICreateRoomResponse, IGetRoomRequest, IGetRoomResponse, IGetRoomsResponse,
	IRemoveRoomRequest,
	IRemoveRoomResponse,
	IRoomPublicNameRequest, IRoomPublicNameResponse, ISetRoomContractAddressRequest, ISetRoomContractAddressResponse, IUpdateRoomRequest } from '../types/rooms';

axios.defaults.baseURL = API_URL;

const createRoom = (data: ICreateRoomRequest): Promise<ICreateRoomResponse> => {
	return axios.post('', {
		query: `
			mutation {
				createRoom(room: {
					internalName: "${data.internalName}",
					area: ${data.area},
					location: "${data.location}"
				}) {
					id, internalName, area, location
				}
			}
		`,
	}).then((res) => res.data);
};

const getRooms = (): Promise<IGetRoomsResponse> => {
	return axios.post('', {
		query: `
			query {
				rooms {
					id,
					internalName,
					area,
					location,
					contractAddress,
					publicName
				}
			}
		`
	}).then((res) => res.data);
};

const getRoom = (data: IGetRoomRequest): Promise<IGetRoomResponse> => {
	return axios.post('', {
		query: `
			query {
				room(id: "${data.id}") {
					id,
					internalName,
					area,
					location,
					contractAddress,
					publicName
				}
			}
		`
	}).then((res) => res.data);
};

const updateRoom = (data: IUpdateRoomRequest): Promise<IGetRoomResponse> => {
	return axios.post('', {
		query: `
			mutation {
				editRoom(id: "${data.id}",
					room: {
						internalName: "${data.internalName}",
						area: ${data.area},
						location: "${data.location}"
					}
				) {
					id,
					internalName,
					area,
					location,
					contractAddress,
					publicName
				}
			}
		`,
	}).then((res) => res.data);
};

const setRoomPublicName = (data: IRoomPublicNameRequest): Promise<IRoomPublicNameResponse> => {
	if(data.publicName) {
		return axios.post('', {
			query: `
				mutation {
					setRoomPublicName(id: "${data.id}", publicName: "${data.publicName}") {
						id, publicName
					}
				}
			`
		}).then((res) => res.data);
	}
	else {
		return axios.post('', {
			query: `
				mutation {
					setRoomPublicName(id: "${data.id}") {
						id, publicName
					}
				}
			`
		}).then((res) => res.data);
	}
};

const setRoomContractAddress = (data: ISetRoomContractAddressRequest): Promise<ISetRoomContractAddressResponse> => {
	return axios.post('', {
		query: `
			mutation {
				setRoomContractAddress(
					id: "<room-id>",
					contractAddress: "<contract-address>"
				) {
					id, contractAddress
				}
			}
		`
	}).then((res) => res.data);
};

const removeRoom = (data: IRemoveRoomRequest): Promise<IRemoveRoomResponse> => {
	return axios.post('', {
		query: `
			mutation {
				removeRoom(id: "${data.id}") {
					id, internalName, area, location
				}
			}
		`
	}).then((res) => res.data);
};

export {
	createRoom,
	getRoom,
	updateRoom,
	getRooms,
	setRoomPublicName,
	setRoomContractAddress,
	removeRoom,
};
