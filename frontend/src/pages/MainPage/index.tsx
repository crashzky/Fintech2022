import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { authenticate, requestAuthentication } from '../../shared/api/auth';
import { deserializeSignature, exportRecoveryParam } from 'rsv-signature';

const MainPage = (): JSX.Element => {
	const { ethereum } = window as any;
	const [accountAddress, setAccountAddress] = useState(null);
	const [isConnected, setIsConnected] = useState(false);
	const [accountAddressRequest, setAccountAddressRequest] = useState('');

	const authRequestMutation = useMutation(requestAuthentication);
	const authenticateMutation = useMutation(authenticate);

	useEffect(() => {
		if(localStorage.getItem('connected_account')) {
			ethereum.request({ method: 'eth_requestAccounts' }).then((res: any) => {
				console.log(res);
				if(localStorage.getItem('connected_account') !== res[0]) {
					setIsConnected(true);
				}
				else
					setAccountAddress(localStorage.getItem('connected_account') as any);
			});
		}
	}, []);
	
	useEffect(() => {
		if(authRequestMutation.isSuccess) {
			console.log(authRequestMutation.data.data.message);
			ethereum.request({ method: 'personal_sign', from: accountAddressRequest, params: [
				[
					{
						type: 'string',
						name: 'Message',
						value: authRequestMutation.data.data.message
					},
				],
				accountAddressRequest
			] }).then((result: any) => {				
				authenticateMutation.mutate({
					address: accountAddressRequest,
					signedMessage: {
						r: '0x' + result.substring(2).substring(0, 64),
						s: '0x' + result.substring(2).substring(64, 128),
						v: '0x' + result.substring(2).substring(128, 130),
					},
				});
				setAccountAddress(accountAddressRequest as any);
				localStorage.setItem('connected_account', accountAddressRequest);
			});
		}
	}, [authRequestMutation.isSuccess]);

	useEffect(() => {
		if(authenticateMutation.isSuccess) {
			setAccountAddress(authenticateMutation.data.data.authentication.address as any);
			localStorage.setItem('connected_account', authenticateMutation.data.data.authentication.address);
			localStorage.setItem('is_landlord', authenticateMutation.data.data.authentication.isLandlord.toString());
		}
	}, [authenticateMutation.isSuccess]);

	if(!accountAddress) {
		return (
			<>
				<button className='authentication__authenticate' onClick={async () => {
					ethereum.request({ method: 'eth_requestAccounts' }).then((res: any) => {
						authRequestMutation.mutate({
							address: res[0],
						});
						setAccountAddressRequest(res[0]);
					});
				}}>
	
				</button>
				{isConnected && (
					<p className='authentication__warning'>
						Your MetaMask account is different from the one you authenticated with before
					</p>
				)}
			</>
		);
	}
	else {
		return (
			<p className='account__address'>
				{accountAddress}
			</p>
		);
	}
};

export default MainPage;
