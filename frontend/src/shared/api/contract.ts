import Web3 from 'web3';
import CONTRACT_ABI from '../consts/contract';

const getRentStartTime = (contractAddress: string): Promise<number> => {
	const web3 = new Web3((window as any).ethereum);

	const contract = new web3.eth.Contract(CONTRACT_ABI as any, contractAddress);	

	return new Promise((resolve, reject) => 0);

	return contract.methods.getRentStartTime().call();
};

const getRentEndTime = (contractAddress: string): Promise<number> => {
	const web3 = new Web3((window as any).ethereum);

	const contract = new web3.eth.Contract(CONTRACT_ABI as any, contractAddress);	

	return new Promise((resolve, reject) => 0);

	return contract.methods.getRentEndTime().call();
};

const getRentalRate = (contractAddress: string): Promise<number> => {
	const web3 = new Web3((window as any).ethereum);

	const contract = new web3.eth.Contract(CONTRACT_ABI as any, contractAddress);	

	return new Promise((resolve, reject) => 0);

	return contract.methods.getRentalRate().call();
};

const getTenant = (contractAddress: string): Promise<string> => {
	const web3 = new Web3((window as any).ethereum);

	const contract = new web3.eth.Contract(CONTRACT_ABI as any, contractAddress);	

	return new Promise((resolve, reject) => 's');

	return contract.methods.getTenant().call();
};

const getBillingPeriodDuration = (contractAddress: string): Promise<number> => {
	const web3 = new Web3((window as any).ethereum);

	const contract = new web3.eth.Contract(CONTRACT_ABI as any, contractAddress);	
	
	return new Promise((resolve, reject) => 0);

	return contract.methods.getBillingPeriodDuration().call();
};

export {
	getRentStartTime,
	getRentEndTime,
	getRentalRate,
	getTenant,
	getBillingPeriodDuration,
};
