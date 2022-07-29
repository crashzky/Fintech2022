from web3 import Web3, EthereumTesterProvider
from eip712_structs import *


class RentalAgreement(EIP712Struct):
	deadline = Uint(256)
	tenant = Address()
	rentalRate = Uint(256)
	billingPeriodDuration = Uint(256)
	billingsCount = Uint(256)


def make_domain_separator(address):
	return make_domain(
		name="Rental Agreement",
		version="1.0",
		verifyingContract = address
	)


w3 = Web3(EthereumTesterProvider())
ecr_contract = contract(bytecode= None)


def ecrecover(message_hash, v, r, s):
	pass


domain_sep = make_domain_separator("0x5ce9454909639D2D17A3F753ce7d93fa0b9aB12E")
print(Message().to_message(domain_sep))