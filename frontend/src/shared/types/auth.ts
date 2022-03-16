interface IAuthenticationRequest {
	address: string;
}

interface IAuthenticationResponse {
	data: {
		message: string;
	}
}

export type {
	IAuthenticationRequest,
	IAuthenticationResponse,
};
