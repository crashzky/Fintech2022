import axios from 'axios';
import { API_URL } from '../consts/api';
import { IAuthenticationRequest, IAuthenticationResponse } from '../types/auth';

axios.defaults.baseURL = API_URL;

const requestAuthentication = (data: IAuthenticationRequest): Promise<IAuthenticationResponse> => {
	return axios.post('', {
		query: `
			mutation {
				message: requestAuthentication(
					address: "${data.address}"
				)
			}
		`
	}).then((res) => res.data);
};

export {
	requestAuthentication,
};
