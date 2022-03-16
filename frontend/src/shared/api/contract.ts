import Web3 from 'web3';
import CONTRACT_ABI from '../consts/contract';

const getRentStartTime = (contractAddress: string): Promise<any> => {
	const web3 = new Web3((window as any).ethereum);

	const contract = new web3.eth.Contract(CONTRACT_ABI as any, contractAddress);	

	return contract.methods.getRentStartTime().call();
};

const getRentEndTime = (contractAddress: string): Promise<any> => {
	const web3 = new Web3((window as any).ethereum);

	const contract = new web3.eth.Contract(CONTRACT_ABI as any, contractAddress);	

	return contract.methods.getRentEndTime().call();
};

export {
	getRentStartTime,
	getRentEndTime,
};
