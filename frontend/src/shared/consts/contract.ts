const CONTRACT_ABI = [
	{
	  inputs: [ [Object] ],
	  stateMutability: 'nonpayable',
	  type: 'constructor'
	},
	{
	  anonymous: false,
	  inputs: [ [Object] ],
	  name: 'PurchasePayment',
	  type: 'event'
	},
	{
	  inputs: [ [Object] ],
	  name: 'addCashier',
	  outputs: [],
	  stateMutability: 'nonpayable',
	  type: 'function'
	},
	{
	  inputs: [ [Object] ],
	  name: 'cashiersList',
	  outputs: [ [Object] ],
	  stateMutability: 'view',
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
	  name: 'getCashiersList',
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
	  inputs: [ [Object], [Object], [Object], [Object] ],
	  name: 'pay',
	  outputs: [],
	  stateMutability: 'payable',
	  type: 'function'
	},
	{
	  inputs: [ [Object] ],
	  name: 'removeCashier',
	  outputs: [],
	  stateMutability: 'nonpayable',
	  type: 'function'
	},
	{
	  inputs: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
	  name: 'rent',
	  outputs: [],
	  stateMutability: 'payable',
	  type: 'function'
	}
];

export default CONTRACT_ABI;