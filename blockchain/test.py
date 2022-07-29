import pytest
from web3 import Web3, EthereumTesterProvider
import solcx

@pytest.fixture
def tester_provider():
	return EthereumTesterProvider()


@pytest.fixture
def eth_tester(tester_provider):
	return tester_provider.ethereum_tester


@pytest.fixture
def w3(tester_provider):
	return Web3(tester_provider)


@pytest.fixture
def contract(w3):
	with open("contracts/RentalAgreement.sol") as f:
		contract_src = f.read()
		contract_artifacts = solcx.compile_source(
			contract_src,
			output_values=["abi", "bin"],
			solc_version="0.8.11"
		)
		contract_artifacts = contract_artifacts["<stdin>:RentalAgreement"]
		abi = contract_artifacts["abi"]
		bytecode = contract_artifacts["bin"]
		return w3.eth.contract(abi=abi, bytecode=bytecode)


@pytest.fixture
def landlord(eth_tester):
	return eth_tester.get_accounts()[0]


@pytest.fixture
def tenant(eth_tester):
	return eth_tester.get_accounts()[1]


def test_us001(w3, contract, landlord):
	tx_hash = contract.constructor(2419200).transact({"from": landlord})
	address = w3.eth.wait_for_transaction_receipt(tx_hash)["contractAddress"]
	contract = contract(address)
	assert 2419200 == contract.functions.getRoomInternalId().call()
	assert landlord == contract.functions.getLandlord().call()


def test_us002_01(w3, contract, landlord):
	tx_hash = contract.constructor(2419200).transact({"from": landlord})
	address = w3.eth.wait_for_transaction_receipt(tx_hash)["contractAddress"]
	contract = contract(address)
	assert 2419200 == contract.functions.getRoomInternalId().call()