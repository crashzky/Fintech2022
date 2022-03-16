import web3

from src.env import RPC_URL

w3 = web3.Web3(web3.HTTPProvider(RPC_URL))
