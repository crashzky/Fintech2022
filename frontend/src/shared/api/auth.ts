import axios from 'axios';
import { API_URL } from '../consts/api';
import { IAuthenticateRequest, IAuthenticateResponse, IAuthenticationRequest, IAuthenticationResponse } from '../types/auth';

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

const authenticate = (data: IAuthenticateRequest): Promise<IAuthenticateResponse> => {
	return axios.post('', {
		query: `
			mutation {
				authentication: authenticate(
					address: "${data.address}",
					signedMessage: {
						v: "${data.signedMessage.v}",
						r: "${data.signedMessage.r}",
						s: "${data.signedMessage.s}",
					}
				) {
					address,
					isLandlord
				}
			}
		`,
	}).then((res) => res.data);
};

const checkAuntefication = (): Promise<IAuthenticateResponse> => {
	return axios.post('', {
		query: `
			query {
				authentication: authentication {
					address,
					isLandlord
				}
			}
		`
	}).then((res) => res.data);
};

export {
	requestAuthentication,
	authenticate,
	checkAuntefication,
};
