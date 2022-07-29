import { AppProps } from 'next/app';
import Head from 'next/head';
import { ThirdwebWeb3Provider } from '@3rdweb/hooks';

import 'regenerator-runtime/runtime';

import '../styles/globals.css';

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
	return (
		<ThirdwebWeb3Provider
			connectors={{
				injected: {},
			}}
			supportedChainIds={[80001, 4]}
		>
			<Head>
				<title>
					NFT
				</title>
			</Head>
			<Component {...pageProps} />
		</ThirdwebWeb3Provider>
	);
};

export default App;
