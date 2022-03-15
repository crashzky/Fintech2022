import React from 'react';
import { Connectors } from 'web3-react';
import Web3Provider from 'web3-react'
import MainPage from './pages';

const App = (): JSX.Element => {
	const { InjectedConnector } = Connectors;
	const MetaMask = new InjectedConnector({ supportedNetworks: [1, 4] });
	const connectors = { MetaMask };

	return (
		<Web3Provider
      		connectors={connectors}
     		libraryName='web3.js' >
			<MainPage />
        </Web3Provider>
	);
};

export default App;
