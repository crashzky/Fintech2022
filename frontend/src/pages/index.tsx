import { useEffect, useState } from 'react';

const MainPage = (): JSX.Element => {
	const { ethereum } = window as any;
	const [accountAddress, setAccountAddress] = useState(null);
	const [isConnected, setIsConnected] = useState(false);

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

	if(!accountAddress) {
		return (
			<>
				<button className='authentication__authenticate' onClick={async () => {
					ethereum.request({ method: 'eth_requestAccounts' }).then((res: any) => {
						ethereum.request({ method: 'personal_sign', from: res[0], params: [
							[
								{
									type: 'string',
									name: 'Message',
									value: 'Подтвердите подписание'
								},
							],
							res[0]
						] }).then((result: any) => {
							setAccountAddress(res[0]);
							localStorage.setItem('connected_account', res[0]);
						});
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
