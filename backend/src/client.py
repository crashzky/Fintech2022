import web3.contract

from src.env import RPC_URL

# solcx.install_solc(version="0.8.11")


# def get_abi():
#     with open("RentalAgreement.sol") as bcfile:
#         compiled_sol = solcx.compile_source(bcfile.read())
#         contract_id, contract_interface = compiled_sol.popitem()
#         return contract_interface["abi"]


w3 = web3.Web3(web3.HTTPProvider(RPC_URL))
contract_abi = """
[{"inputs":[{"internalType":"uint256","name":"roomInternalId","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PurchasePayment","type":"event"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"addCashier","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getBillingPeriodDuration","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"cashierAddr","type":"address"}],"name":"getCashierNonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCashiersList","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getIsRentActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLandlord","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRentEndTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRentStartTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRentalRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRentedState","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRoomInternalId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTenant","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTenantProfit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"value","type":"uint256"},{"components":[{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"internalType":"struct RentalAgreement.Sign","name":"cashierSign","type":"tuple"}],"name":"pay","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"cashierAddr","type":"address"}],"name":"removeCashier","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"address","name":"tenant","type":"address"},{"internalType":"uint256","name":"rentalRate","type":"uint256"},{"internalType":"uint256","name":"billingPeriodDuration","type":"uint256"},{"internalType":"uint256","name":"billingsCount","type":"uint256"},{"components":[{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"internalType":"struct RentalAgreement.Sign","name":"landlordSign","type":"tuple"}],"name":"rent","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"withdrawTenantProfit","outputs":[],"stateMutability":"nonpayable","type":"function"}]
"""


def get_contract(address) -> web3.contract.Contract:
    return w3.eth.contract(
         address=address,
         abi=contract_abi
     )

