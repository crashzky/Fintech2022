import Web3 from 'web3';
import { CONTRACT_ABI, CONTRACT_BYTECODE } from '../consts/contract';

const getRentStartTime = (contractAddress: string): Promise<number> => {
	const web3 = new Web3((window as any).ethereum);

	const contract = new web3.eth.Contract(CONTRACT_ABI as any, contractAddress);	

	return contract.methods.getRentStartTime().call();
};

const getRentEndTime = (contractAddress: string): Promise<number> => {
	const web3 = new Web3((window as any).ethereum);

	const contract = new web3.eth.Contract(CONTRACT_ABI as any, contractAddress);	

	return contract.methods.getRentEndTime().call();
};

const getRentalRate = (contractAddress: string): Promise<number> => {
	const web3 = new Web3((window as any).ethereum);

	const contract = new web3.eth.Contract(CONTRACT_ABI as any, contractAddress);	

	return contract.methods.getRentalRate().call();
};

const getTenant = (contractAddress: string): Promise<string> => {
	const web3 = new Web3((window as any).ethereum);

	const contract = new web3.eth.Contract(CONTRACT_ABI as any, contractAddress);

	return contract.methods.getTenant().call();
};

const getBillingPeriodDuration = (contractAddress: string): Promise<number> => {
	const web3 = new Web3((window as any).ethereum);

	const contract = new web3.eth.Contract(CONTRACT_ABI as any, contractAddress);	

	return contract.methods.getBillingPeriodDuration().call();
};

const deployContract = (roomId: string, accountAddress: string): Promise<any> => {
	const web3 = new Web3((window as any).ethereum);

	const contract = new web3.eth.Contract(CONTRACT_ABI as any);

	return contract.deploy({
		data: web3.utils.bytesToHex(CONTRACT_BYTECODE as any),
		arguments: [web3.utils.hexToNumber('0x' + roomId)],
	}).send({
		from: accountAddress,
		gas: 4700000,
	}, (e, hash) => web3.eth.getTransactionReceipt(hash).then((result) => result.contractAddress));
};

export {
	getRentStartTime,
	getRentEndTime,
	getRentalRate,
	getTenant,
	getBillingPeriodDuration,
	deployContract,
};
