import { useWeb3 } from '@3rdweb/hooks';
import { Contract, ContractFactory, utils } from 'ethers';
import { HELLO_WORLD_ABI, HELLO_WORLD_BYTE } from '../shared/abi/helloWorld';

const MainPage = (): JSX.Element => {
	const { connectWallet, address, error, provider, balance } = useWeb3();

	const signer = provider?.getSigner(address);

	const contract = new Contract('0x7b687416903c5deded102ababc969025276ecb98', HELLO_WORLD_ABI, signer);
	const factory = new ContractFactory(HELLO_WORLD_ABI, HELLO_WORLD_BYTE, signer);

	return (
		<main>
			{address && (
				<p>
					{address}
				</p>
			)}
			{error && (
				<p className='text-red-500'>
					{error.message}
				</p>
			)}
			{balance && (
				<p className='text-green-500'>
					{balance.formatted}
				</p>
			)}
			<button
				onClick={() => connectWallet('injected')}
				className='block mx-auto mt-20 bg-blue-500 rounded-xl text-white py-3 px-6'
			>
				Connect wallet
			</button>
			<button
				onClick={() => signer?.signMessage('hello').then((res) => console.log(res))}
				className='block mx-auto mt-20 bg-blue-500 rounded-xl text-white py-3 px-6'
			>
				Sign message
			</button>
			<button
				onClick={() => signer?.sendTransaction({
					from: address,
					to: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
					value: utils.parseEther('0'),
					nonce: provider?.getTransactionCount(address as string, 'latest'),
					gasLimit: utils.hexlify(0), // 100000
					gasPrice: provider?.getGasPrice(),
				})}
				className='block mx-auto mt-20 bg-blue-500 rounded-xl text-white py-3 px-6'
			>
				Send transaction
			</button>
			<button
				onClick={async () => {
					const tx = await contract.sayHelloWorld();

					console.log(tx);
				}}
				className='block mx-auto mt-20 bg-blue-500 rounded-xl text-white py-3 px-6'
			>
				sayHelloWorld()
			</button>
			<button
				onClick={async () => {
					const contract = await factory.deploy();

					console.log(contract);
				}}
				className='block mx-auto mt-20 bg-blue-500 rounded-xl text-white py-3 px-6'
			>
				Deploy contract
			</button>
		</main>
	);
};

export default MainPage;
