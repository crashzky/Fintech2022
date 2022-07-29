from web3 import Web3, EthereumTesterProvider

with open("contracts/EIP712.bin", "r") as f:
	bytecode = f.read()
with open("contracts/EIP712.abi", "r") as f:
	abi = f.read()

provider = EthereumTesterProvider()
w3 = Web3(provider)
contract = w3.eth.contract(abi=abi, bytecode=bytecode)
tx_hash = contract.constructor().transact({"from": provider.ethereum_tester.get_accounts()[0]})
tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash, 180)
contract = contract(tx_receipt.contractAddress)


def ecrecover(addr, deadline, nonce, value, v, r, s):
	w3.eth.wait_for_transaction_receipt(contract.functions.setSign(v, r, s).transact())
	return contract.functions.recover(addr, deadline, nonce, value).call()


a = ecrecover(
	"0xD06a2aeaD9f5c6b462De25030de01BedE4609ff8",
	1647568326,
	24177887017130179171367387607111757570297742573013386973098268051170680108980,
	100000,
	0x1c,
	"0xab6671b52b2d0908c58822508d0d16403549f52b475274abd017f9fa45d99263",
	"0x75e865f722685997841ea3392b13fe3d54f1ad40b74a08435c8cb292ef736350",
)
print(a)