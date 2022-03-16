import Web3 from 'web3';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { authenticate, checkAuntefication, requestAuthentication } from '../../shared/api/auth';

const MainPage = (): JSX.Element => {
	const [accountAddress, setAccountAddress] = useState(null);
	const [isAnotherAccount, setIsAnotherAccount] = useState(false);
	const [accountAddressRequest, setAccountAddressRequest] = useState('');

	const authRequestMutation = useMutation(requestAuthentication);
	const authenticateMutation = useMutation(authenticate);
	const checkAuth = useMutation(checkAuntefication);
	
	const web3 = new Web3((window as any).ethereum);

	useEffect(() => {
		if(localStorage.getItem('connected_account')) {
			web3.eth.requestAccounts().then((res: any) => {
				setAccountAddressRequest(res[0]);
				checkAuth.mutate();
			});
		}
	}, []);

	useEffect(() => {
		if(checkAuth.isSuccess) {
			if(accountAddressRequest !== checkAuth.data.data.authentication.address)
				setIsAnotherAccount(true);
			else
				setAccountAddress(localStorage.getItem('connected_account') as any);
		}
	}, [checkAuth.isSuccess]);
	
	useEffect(() => {
		if(authRequestMutation.isSuccess) {
			web3.eth.personal.sign(authRequestMutation.data.data.message, accountAddressRequest, '').then((result) => {
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
			})
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
					web3.eth.requestAccounts().then((res: any) => {
						authRequestMutation.mutate({
							address: res[0]
						});
						setAccountAddressRequest(res[0]);
					});
				}}>
	
				</button>
				{isAnotherAccount && (
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
