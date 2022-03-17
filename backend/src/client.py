import web3.contract
import solcx

from src.env import RPC_URL

solcx.install_solc(version="0.8.11")

def get_abi():
    with open("RentalAgreement.sol") as bcfile:
        compiled_sol = solcx.compile_source(bcfile.read())
        contract_id, contract_interface = compiled_sol.popitem()
        return contract_interface["abi"]


w3 = web3.Web3(web3.HTTPProvider(RPC_URL))
contract_abi = get_abi()


def get_contract(address) -> web3.contract.Contract:
    return w3.eth.contract(
         address=address,
         abi=contract_abi
     )

