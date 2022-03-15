import { useEffect, useState } from 'react';

const App2 = (): JSX.Element => {
	const { ethereum } = window as any;
	const [accountAddress, setAccountAddress] = useState(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		ethereum.request({ method: 'eth_requestAccounts' }).then((res: any) => {
			if(localStorage.getItem('connected_accounts')) {
				let _account = JSON.parse(localStorage.getItem('connected_accounts') as string);
				res.forEach((i: string) => {
					if(_account.includes(i))
						setIsConnected(true);
				});
			}
		});
	}, []);

	if(!accountAddress) {
		return (
			<>
				<button className='authentication__authenticate' onClick={async () => {
					ethereum.request({ method: 'eth_requestAccounts' }).then((res: any) => {
						ethereum.request({ method: 'eth_signTypedData', from: res[0], params: [
							[
								{
									type: 'string',
									name: 'Message',
									value: 'Подтвердите подписание'
								},
							],
							res[0]
						] }).then(() => {
							setAccountAddress(res[0]);

							let _account = [];
							if(localStorage.getItem('connected_accounts')) {
								_account = JSON.parse(localStorage.getItem('connected_accounts') as string);
							}
							_account.push(res[0]);
							localStorage.setItem('connected_accounts', JSON.stringify(_account));
						});
					});
				}}>
	
				</button>
				{isConnected && (
					<p className='authentication__warning'>
						Your MetaMask account is different from the one you authenticated with before.
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

export default App2;
