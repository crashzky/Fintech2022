interface IAuthenticationRequest {
	address: string;
}

interface IAuthenticationResponse {
	data: {
		message: string;
	}
}

interface IAuthenticateRequest {
	address: string;
	signedMessage: {
		r: string;
		s: string;
		v: string;
	}
}

interface IAuthenticateResponse {
	data: {
		authentication: {
			address: string;
			isLandlord: boolean;
		}
	}
}

export type {
	IAuthenticationRequest,
	IAuthenticationResponse,
	IAuthenticateRequest,
	IAuthenticateResponse
};
