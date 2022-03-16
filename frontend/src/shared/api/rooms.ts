import axios from 'axios';
import { API_URL } from '../consts/api';
import { ICreateRoomRequest, ICreateRoomResponse } from '../types/rooms';

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
	})
};

export {
	createRoom,
};
