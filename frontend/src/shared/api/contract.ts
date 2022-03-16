import CONTRACT_CODE from '../consts/contract';
import Web3 from 'web3';

const solc = require('solc');

const getRentStartTime = (contractAddress: string): Promise<any> => {
	const web3 = new Web3((window as any).ethereum);

	const input = {
		language: 'Solidity',
		sources: {
		  'test.sol': {
			content: CONTRACT_CODE,
		  }
		},
		settings: {
		  outputSelection: {
			'*': {
			  '*': ['*']
			}
		  }
		}
	};

	const output = JSON.parse(solc.compile(JSON.stringify(input)));

	const contract = new web3.eth.Contract(output as any, contractAddress);	

	return contract.methods.getRentStartTime().call();
};

export {
	getRentStartTime,
};
