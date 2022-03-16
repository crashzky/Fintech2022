import axios from 'axios';
import { API_URL } from '../consts/api';
import { ICreateRoomRequest, ICreateRoomResponse, IGetRoomRequest, IGetRoomResponse, IUpdateRoomRequest } from '../types/rooms';

axios.defaults.baseURL = API_URL;

const createRoom = (data: ICreateRoomRequest): Promise<ICreateRoomResponse> => {
	return axios.post('', {
		query: `
			mutation {
				rooms: createRoom(room: {
						internalName: "${data.internalName}",
						area: ${data.area},
						location: "${data.location}"
					}) {
					id, internalName, area, location
				}
			}
		`,
	})
};

const getRoom = (data: IGetRoomRequest): Promise<IGetRoomResponse> => {
	return axios.post('', {
		query: `
			query {
				room(id: "${data.id}") {
					internalName,
					area,
					location,
					contractAddress
				}
			}
		`
	}).then((res) => res.data);
};

const updateRoom = (data: IUpdateRoomRequest): Promise<IGetRoomResponse> => {
	return axios.post('', {
		query: `
			mutation {
				rooms: createRoom(room: {
						internalName: "${data.internalName}",
						area: ${data.area},
						location: "${data.location}"
					}) {
					id, internalName, area, location
				}
			}
		`,
	})
};

export {
	createRoom,
	getRoom,
	updateRoom,
};
