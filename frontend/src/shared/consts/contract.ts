const CONTRACT_ABI = JSON.parse(`[{"inputs":[{"internalType":"uint256","name":"roomInternalId","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PurchasePayment","type":"event"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"addCashier","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"cashiersList","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getBillingPeriodDuration","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"cashierAddr","type":"address"}],"name":"getCashierNonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCashiersList","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLandlord","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRentEndTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRentStartTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRentalRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRentedState","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRoomInternalId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTenant","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"value","type":"uint256"},{"components":[{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"internalType":"struct RentalAgreement.Sign","name":"cashierSign","type":"tuple"}],"name":"pay","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"cashierAddr","type":"address"}],"name":"removeCashier","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"address","name":"tenant","type":"address"},{"internalType":"uint256","name":"rentalRate","type":"uint256"},{"internalType":"uint256","name":"billingPeriodDuration","type":"uint256"},{"internalType":"uint256","name":"billingsCount","type":"uint256"},{"components":[{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"internalType":"struct RentalAgreement.Sign","name":"landlordSign","type":"tuple"}],"name":"rent","outputs":[],"stateMutability":"payable","type":"function"}]`);

const CONTRACT_BYTECODE = `
60806040526000600760006101000a81548160ff0219169083151502179055506001600d556000600e556000600f60006101000a81548160ff0219169083151502179055503480156200005157600080fd5b50604051620023fc380380620023fc833981810160405281019062000077919062000106565b8060008190555033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505062000138565b600080fd5b6000819050919050565b620000e081620000cb565b8114620000ec57600080fd5b50565b6000815190506200010081620000d5565b92915050565b6000602082840312156200011f576200011e620000c6565b5b60006200012f84828501620000ef565b91505092915050565b6122b480620001486000396000f3fe6080604052600436106100e85760003560e01c80638df0feaf1161008a578063acfcc31011610059578063acfcc310146102ca578063d3b12eb8146102f5578063e82372641461031e578063f502236d14610349576100e8565b80638df0feaf1461021e5780638e16bb0e146102495780639498087d146102745780639946c6d41461029f576100e8565b8063466eef04116100c6578063466eef041461015f5780634e1be5dc1461017b578063589ac6f8146101b8578063619c3b99146101f5576100e8565b80630b3bb024146100ed57806330f5517814610118578063314fde8714610143575b600080fd5b3480156100f957600080fd5b50610102610374565b60405161010f91906113aa565b60405180910390f35b34801561012457600080fd5b5061012d61039e565b60405161013a91906113de565b60405180910390f35b61015d60048036038101906101589190611598565b6103a8565b005b6101796004803603810190610174919061162b565b610469565b005b34801561018757600080fd5b506101a2600480360381019061019d91906116b9565b610a45565b6040516101af91906113de565b60405180910390f35b3480156101c457600080fd5b506101df60048036038101906101da91906116e6565b610a91565b6040516101ec91906113aa565b60405180910390f35b34801561020157600080fd5b5061021c600480360381019061021791906116b9565b610ad0565b005b34801561022a57600080fd5b50610233610e85565b60405161024091906113de565b60405180910390f35b34801561025557600080fd5b5061025e610e8f565b60405161026b91906113de565b60405180910390f35b34801561028057600080fd5b50610289610e99565b60405161029691906113de565b60405180910390f35b3480156102ab57600080fd5b506102b4610ea2565b6040516102c1919061172e565b60405180910390f35b3480156102d657600080fd5b506102df610eb9565b6040516102ec91906113de565b60405180910390f35b34801561030157600080fd5b5061031c600480360381019061031791906116b9565b610ec3565b005b34801561032a57600080fd5b506103336112ae565b6040516103409190611807565b60405180910390f35b34801561035557600080fd5b5061035e61133f565b60405161036b91906113aa565b60405180910390f35b6000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6000600354905090565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc839081150290604051600060405180830381858888f19350505050158015610410573d6000803e3d6000fd5b507f2c988e1d31b3b4fd28fb0d6ca6503bddd6944a61b2d846e8306c67e3a4cf98c58260405161044091906113de565b60405180910390a16001600f60006101000a81548160ff02191690831515021790555050505050565b600760009054906101000a900460ff16156104b9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104b0906118ac565b60405180910390fd5b84600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550836003819055508260048190555042600581905550828261051b91906118fb565b6005546105289190611955565b6006819055506001600760006101000a81548160ff02191690831515021790555060007f91ab3d17e3a50a9d89e63fd30b92be7f5336b03b287bb946787a83a9d62a27666040518060400160405280601081526020017f52656e74616c2041677265656d656e7400000000000000000000000000000000815250805190602001206040518060400160405280600381526020017f312e30000000000000000000000000000000000000000000000000000000000081525080519060200120306040516020016105fa94939291906119ba565b60405160208183030381529060405280519060200120905060007f82caaa1f53b9edc3e1fc32286785a322f989809aab37c211c26141a6d7c0917d888888888860405160200161064f969594939291906119ff565b6040516020818303038152906040528051906020012090506000828260405160200161067c929190611ad8565b6040516020818303038152906040528051906020012090506000600182866000015187602001518860400151604051600081526020016040526040516106c59493929190611b1e565b6020604051602081039080840390855afa1580156106e7573d6000803e3d6000fd5b505050602060405103519050600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610783576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161077a90611baf565b60405180910390fd5b894211156107c6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107bd90611c1b565b60405180910390fd5b8873ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610834576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161082b90611cd3565b60405180910390fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156108c5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108bc90611d65565b60405180910390fd5b60008811610908576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108ff90611df7565b60405180910390fd5b6000871161094b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161094290611e89565b60405180910390fd5b6000861161098e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161098590611f1b565b60405180910390fd5b8734146109d0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109c790611f87565b60405180910390fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc899081150290604051600060405180830381858888f19350505050158015610a38573d6000803e3d6000fd5b5050505050505050505050565b6000600860010160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b600c8181548110610aa157600080fd5b906000526020600020016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610b60576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b5790611ff3565b60405180910390fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610bf1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610be890612085565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610c61576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c5890612117565b60405180910390fd5b600860030160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615610d1657600d60008154610cc590612137565b919050819055600860010160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550610e82565b6001600860030160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550600d60008154610d8090612137565b919050819055600860010160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550600860000180549050600860020160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506008600001819080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b50565b6000600554905090565b6000600454905090565b60008054905090565b6000600760009054906101000a900460ff16905090565b6000600654905090565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610f53576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f4a90611ff3565b60405180910390fd5b6000600860010160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541415610fd9576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610fd0906121cc565b60405180910390fd5b600860030160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16611032576112ab565b600860030160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81549060ff0219169055600860010160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600090556000600860020160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490506000600160086000018054905061112891906121ec565b905060006008600001828154811061114357611142612220565b5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905082600860020160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550600860020160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009055806008600001848154811061121557611214612220565b5b9060005260206000200160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060086000018054806112725761127161224f565b5b6001900381819060005260206000200160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905590555050505b50565b6060600860000180548060200260200160405190810160405280929190818152602001828054801561133557602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190600101908083116112eb575b5050505050905090565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061139482611369565b9050919050565b6113a481611389565b82525050565b60006020820190506113bf600083018461139b565b92915050565b6000819050919050565b6113d8816113c5565b82525050565b60006020820190506113f360008301846113cf565b92915050565b6000604051905090565b600080fd5b611411816113c5565b811461141c57600080fd5b50565b60008135905061142e81611408565b92915050565b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61148282611439565b810181811067ffffffffffffffff821117156114a1576114a061144a565b5b80604052505050565b60006114b46113f9565b90506114c08282611479565b919050565b600060ff82169050919050565b6114db816114c5565b81146114e657600080fd5b50565b6000813590506114f8816114d2565b92915050565b6000819050919050565b611511816114fe565b811461151c57600080fd5b50565b60008135905061152e81611508565b92915050565b60006060828403121561154a57611549611434565b5b61155460606114aa565b90506000611564848285016114e9565b60008301525060206115788482850161151f565b602083015250604061158c8482850161151f565b60408301525092915050565b60008060008060c085870312156115b2576115b1611403565b5b60006115c08782880161141f565b94505060206115d18782880161141f565b93505060406115e28782880161141f565b92505060606115f387828801611534565b91505092959194509250565b61160881611389565b811461161357600080fd5b50565b600081359050611625816115ff565b92915050565b600080600080600080610100878903121561164957611648611403565b5b600061165789828a0161141f565b965050602061166889828a01611616565b955050604061167989828a0161141f565b945050606061168a89828a0161141f565b935050608061169b89828a0161141f565b92505060a06116ac89828a01611534565b9150509295509295509295565b6000602082840312156116cf576116ce611403565b5b60006116dd84828501611616565b91505092915050565b6000602082840312156116fc576116fb611403565b5b600061170a8482850161141f565b91505092915050565b60008115159050919050565b61172881611713565b82525050565b6000602082019050611743600083018461171f565b92915050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b61177e81611389565b82525050565b60006117908383611775565b60208301905092915050565b6000602082019050919050565b60006117b482611749565b6117be8185611754565b93506117c983611765565b8060005b838110156117fa5781516117e18882611784565b97506117ec8361179c565b9250506001810190506117cd565b5085935050505092915050565b6000602082019050818103600083015261182181846117a9565b905092915050565b600082825260208201905092915050565b7f54686520636f6e7472616374206973206265696e6720696e206e6f7420616c6c60008201527f6f77656420737461746500000000000000000000000000000000000000000000602082015250565b6000611896602a83611829565b91506118a18261183a565b604082019050919050565b600060208201905081810360008301526118c581611889565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000611906826113c5565b9150611911836113c5565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff048311821515161561194a576119496118cc565b5b828202905092915050565b6000611960826113c5565b915061196b836113c5565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156119a05761199f6118cc565b5b828201905092915050565b6119b4816114fe565b82525050565b60006080820190506119cf60008301876119ab565b6119dc60208301866119ab565b6119e960408301856119ab565b6119f6606083018461139b565b95945050505050565b600060c082019050611a1460008301896119ab565b611a2160208301886113cf565b611a2e604083018761139b565b611a3b60608301866113cf565b611a4860808301856113cf565b611a5560a08301846113cf565b979650505050505050565b600081905092915050565b7f1901000000000000000000000000000000000000000000000000000000000000600082015250565b6000611aa1600283611a60565b9150611aac82611a6b565b600282019050919050565b6000819050919050565b611ad2611acd826114fe565b611ab7565b82525050565b6000611ae382611a94565b9150611aef8285611ac1565b602082019150611aff8284611ac1565b6020820191508190509392505050565b611b18816114c5565b82525050565b6000608082019050611b3360008301876119ab565b611b406020830186611b0f565b611b4d60408301856119ab565b611b5a60608301846119ab565b95945050505050565b7f496e76616c6964206c616e646c6f7264207369676e0000000000000000000000600082015250565b6000611b99601583611829565b9150611ba482611b63565b602082019050919050565b60006020820190508181036000830152611bc881611b8c565b9050919050565b7f546865206f7065726174696f6e206973206f7574646174656400000000000000600082015250565b6000611c05601983611829565b9150611c1082611bcf565b602082019050919050565b60006020820190508181036000830152611c3481611bf8565b9050919050565b7f5468652063616c6c6572206163636f756e7420616e6420746865206163636f7560008201527f6e742073706563696669656420617320612074656e616e7420646f206e6f742060208201527f6d61746368000000000000000000000000000000000000000000000000000000604082015250565b6000611cbd604583611829565b9150611cc882611c3b565b606082019050919050565b60006020820190508181036000830152611cec81611cb0565b9050919050565b7f546865206c616e646c6f72642063616e6e6f74206265636f6d6520612074656e60008201527f616e740000000000000000000000000000000000000000000000000000000000602082015250565b6000611d4f602383611829565b9150611d5a82611cf3565b604082019050919050565b60006020820190508181036000830152611d7e81611d42565b9050919050565b7f52656e7420616d6f756e742073686f756c64206265207374726963746c79206760008201527f726561746572207468616e207a65726f00000000000000000000000000000000602082015250565b6000611de1603083611829565b9150611dec82611d85565b604082019050919050565b60006020820190508181036000830152611e1081611dd4565b9050919050565b7f52656e7420706572696f642073686f756c64206265207374726963746c79206760008201527f726561746572207468616e207a65726f00000000000000000000000000000000602082015250565b6000611e73603083611829565b9150611e7e82611e17565b604082019050919050565b60006020820190508181036000830152611ea281611e66565b9050919050565b7f52656e7420706572696f6420726570656174732073686f756c6420626520737460008201527f726963746c792067726561746572207468616e207a65726f0000000000000000602082015250565b6000611f05603883611829565b9150611f1082611ea9565b604082019050919050565b60006020820190508181036000830152611f3481611ef8565b9050919050565b7f496e636f7272656374206465706f736974000000000000000000000000000000600082015250565b6000611f71601183611829565b9150611f7c82611f3b565b602082019050919050565b60006020820190508181036000830152611fa081611f64565b9050919050565b7f596f7520617265206e6f7420612074656e616e74000000000000000000000000600082015250565b6000611fdd601483611829565b9150611fe882611fa7565b602082019050919050565b6000602082019050818103600083015261200c81611fd0565b9050919050565b7f546865206c616e646c6f72642063616e6e6f74206265636f6d6520612063617360008201527f6869657200000000000000000000000000000000000000000000000000000000602082015250565b600061206f602483611829565b915061207a82612013565b604082019050919050565b6000602082019050818103600083015261209e81612062565b9050919050565b7f5a65726f20616464726573732063616e6e6f74206265636f6d6520612063617360008201527f6869657200000000000000000000000000000000000000000000000000000000602082015250565b6000612101602483611829565b915061210c826120a5565b604082019050919050565b60006020820190508181036000830152612130816120f4565b9050919050565b6000612142826113c5565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415612175576121746118cc565b5b600182019050919050565b7f556e6b6e6f776e20636173686965720000000000000000000000000000000000600082015250565b60006121b6600f83611829565b91506121c182612180565b602082019050919050565b600060208201905081810360008301526121e5816121a9565b9050919050565b60006121f7826113c5565b9150612202836113c5565b925082821015612215576122146118cc565b5b828203905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603160045260246000fdfea2646970667358221220b7b9f0a3f480ebd23b6840d674107aac53c8aca0773024e020279b3940c23dc164736f6c634300080c0033
`;

export {
	CONTRACT_ABI,
	CONTRACT_BYTECODE,
};
