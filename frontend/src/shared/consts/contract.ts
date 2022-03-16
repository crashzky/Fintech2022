const CONTRACT_ABI = [
	{
	  inputs: [ [Object] ],
	  stateMutability: 'nonpayable',
	  type: 'constructor'
	},
	{
	  inputs: [ [Object], [Object], [Object] ],
	  name: 'EIP712Domain',
	  outputs: [],
	  stateMutability: 'nonpayable',
	  type: 'function'
	},
	{
	  inputs: [ [Object], [Object], [Object], [Object], [Object] ],
	  name: 'RentalPermit',
	  outputs: [],
	  stateMutability: 'nonpayable',
	  type: 'function'
	},
	{
	  inputs: [ [Object] ],
	  name: 'addCashier',
	  outputs: [],
	  stateMutability: 'nonpayable',
	  type: 'function'
	},
	{
	  inputs: [],
	  name: 'getBillingPeriodDuration',
	  outputs: [ [Object] ],
	  stateMutability: 'view',
	  type: 'function'
	},
	{
	  inputs: [ [Object] ],
	  name: 'getCashierNonce',
	  outputs: [ [Object] ],
	  stateMutability: 'view',
	  type: 'function'
	},
	{
	  inputs: [],
	  name: 'getLandlord',
	  outputs: [ [Object] ],
	  stateMutability: 'view',
	  type: 'function'
	},
	{
	  inputs: [],
	  name: 'getRentEndTime',
	  outputs: [ [Object] ],
	  stateMutability: 'view',
	  type: 'function'
	},
	{
	  inputs: [],
	  name: 'getRentStartTime',
	  outputs: [ [Object] ],
	  stateMutability: 'view',
	  type: 'function'
	},
	{
	  inputs: [],
	  name: 'getRentalRate',
	  outputs: [ [Object] ],
	  stateMutability: 'view',
	  type: 'function'
	},
	{
	  inputs: [],
	  name: 'getRoomInternalId',
	  outputs: [ [Object] ],
	  stateMutability: 'view',
	  type: 'function'
	},
	{
	  inputs: [],
	  name: 'getTenant',
	  outputs: [ [Object] ],
	  stateMutability: 'view',
	  type: 'function'
	},
	{
	  inputs: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
	  name: 'rent',
	  outputs: [],
	  stateMutability: 'payable',
	  type: 'function'
	},
	{
	  inputs: [],
	  name: 'sayHelloWorld',
	  outputs: [ [Object] ],
	  stateMutability: 'pure',
	  type: 'function'
	}
];

export default CONTRACT_ABI;