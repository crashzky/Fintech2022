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

const getCashiersList = (contractAddress: string): Promise<string[]> => {
	const web3 = new Web3((window as any).ethereum);

	const contract = new web3.eth.Contract(CONTRACT_ABI as any, contractAddress);	

	return contract.methods.getCashiersList().call();
};

const addCashier = (contractAddress: string, cashierAddress: string, accountAddress: string): Promise<null> => {
	const web3 = new Web3((window as any).ethereum);

	const contract = new web3.eth.Contract(CONTRACT_ABI as any, contractAddress);	

	const balance = web3.eth.getBalance(accountAddress);

	return contract.methods.addCashier(cashierAddress).send({
		from: accountAddress,
		gas: balance
	});
};

const removeCashier = (contractAddress: string, cashierAddress: string, accountAddress: string): Promise<null> => {
	const web3 = new Web3((window as any).ethereum);

	const contract = new web3.eth.Contract(CONTRACT_ABI as any, contractAddress);	

	const balance = web3.eth.getBalance(accountAddress);

	return contract.methods.removeCashier(cashierAddress).send({
		from: accountAddress,
		gas: balance
	});
};

const deployContract = async (roomId: string, accountAddress: string): Promise<any> => {
	const web3 = new Web3((window as any).ethereum);

	const contract = new web3.eth.Contract(CONTRACT_ABI as any);

	let txHash = '';

	await contract.deploy({
		data: web3.utils.bytesToHex(CONTRACT_BYTECODE as any),
		arguments: [web3.utils.hexToNumber('0x' + roomId)],
	}).send({
		from: accountAddress,
		gas: 4200000
	}, (e, hash) => {
		txHash = hash
	});

	return web3.eth.getTransactionReceipt(txHash).then((result) => result.contractAddress);
};

export {
	getRentStartTime,
	getRentEndTime,
	getRentalRate,
	getTenant,
	getBillingPeriodDuration,
	deployContract,
	getCashiersList,
	addCashier,
	removeCashier,
};
