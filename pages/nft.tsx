import { useWeb3 } from '@3rdweb/hooks';
import { Contract, ContractFactory } from 'ethers';
import { useFormik } from 'formik';
import { useState } from 'react';
import { NFT_ABI, NFT_BYTECODE } from '../shared/abi/nft';

const NftPage = (): JSX.Element => {
	const [nftAddress, setNftAddress] = useState('');

	const [nftOwner, setNftOwner] = useState('');
	const [nftContent, setNftContent] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const [deployedNftAddress, setDeployedNftAddress] = useState('');

	const { connectWallet, address, provider } = useWeb3();

	const signer = provider?.getSigner(address);
	
	const formik = useFormik({
		initialValues: {
			content: '',
			owner: '',
		},
		onSubmit: async (values) => {
			const factory = new ContractFactory(NFT_ABI, NFT_BYTECODE, signer);

			const contract = await factory.deploy(values.content, values.owner);

			setDeployedNftAddress(contract.address);
		},
	});

	const formik2 = useFormik({
		initialValues: {
			address: '',
			owner: '',
		},
		onSubmit: async (values) => {
			const contract = new Contract(values.address, NFT_ABI, signer);

			contract.functions.changeNftOwner(values.owner);
		},
	});
	
	return (
		<main>
			{address && (
				<p className='mt-20 text-center'>
					Connected account:
					{' ' + address}
				</p>
			)}
			<button
				onClick={() => connectWallet('injected')}
				className='block mx-auto mt-5 mb-10 bg-blue-500 rounded-xl text-white py-3 px-6'
			>
				Connect wallet
			</button>
			
			{nftOwner && (
				<p className='mt-10 text-center'>
					Nft owner: 
					{' ' + nftOwner}
				</p>	
			)}
			{nftContent && (
				<p className='mt-10 text-center'>
					Nft content: 
					{' ' + nftContent}
				</p>	
			)}
			{errorMessage && (
				<p className='mt-4 text-red-500 text-center'>
					{errorMessage}
				</p>	
			)}
			<input
				className='block mx-auto mt-20 border-2 border-blue-500 px-2 py-1 w-96 rounded-lg'
				value={nftAddress}
				onChange={(e) => setNftAddress(e.target.value)}
				placeholder='nft address' />
			<button
				onClick={() => {
					const contract = new Contract(nftAddress, NFT_ABI, signer);

					contract.functions.getNftOwner().then((res) => {
						setNftOwner(res);
					}).catch((err) => {
						console.log(err.reason);
					});

					contract.functions.getNftUrl().then((res) => {
						setNftContent(res);
					}).catch((err) => {
						setErrorMessage(err.reason);
					});
				}}
				className='block mx-auto mt-5 mb-20 bg-blue-500 rounded-xl text-white py-3 px-6'
			>
				Get nft data
			</button>

			<form onSubmit={formik.handleSubmit}>
				{deployedNftAddress && (
					<p className='text-green-500 mt-10 text-center'>
						Nft deployed at:
						{' ' + deployedNftAddress}
					</p>
				)}
				<input
					className='block mx-auto mt-4 border-2 border-blue-500 px-2 py-1 w-96 rounded-lg'
					value={formik.values.owner}
					onChange={formik.handleChange}
					name='owner'
					placeholder='nft owner' />
				<input
					className='block mx-auto mt-4 border-2 border-blue-500 px-2 py-1 w-96 rounded-lg'
					value={formik.values.content}
					onChange={formik.handleChange}
					name='content'
					placeholder='nft content' />
				<button className='block mx-auto mt-5 bg-blue-500 rounded-xl text-white py-3 px-6'>
					Deploy nft
				</button>
			</form>

			<form onSubmit={formik2.handleSubmit} className='mt-20'>
				<input
					className='block mx-auto mt-4 border-2 border-blue-500 px-2 py-1 w-96 rounded-lg'
					value={formik2.values.address}
					onChange={formik2.handleChange}
					name='address'
					placeholder='nft address' />
				<input
					className='block mx-auto mt-4 border-2 border-blue-500 px-2 py-1 w-96 rounded-lg'
					value={formik2.values.owner}
					onChange={formik2.handleChange}
					name='owner'
					placeholder='new nft owner' />
				<button className='block mx-auto mt-5 bg-blue-500 rounded-xl text-white py-3 px-6'>
					Update owner
				</button>
			</form>
		</main>
	);
};

export default NftPage;
