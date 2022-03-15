import { useEffect } from 'react';
import { useWeb3Context } from 'web3-react';

const MainPage = (): JSX.Element => {
	const context = useWeb3Context()
 
	useEffect(() => {
	  context.setFirstValidConnector(['MetaMask'])
	}, [])
   
	if (!context.active && !context.error) {
		return (
			<h1>
				loading
			</h1>
		);
	} else if (context.error) {
		return (
			<h1>
				error
			</h1>
		);
	} else {
		return (
			<h1>
				Hello world
			</h1>
		);
	}
};

export default MainPage;
