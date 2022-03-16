import os

LANDLORD_ADDRESS = os.getenv("LANDLORD_ADDRESS") or "0x123"
RPC_URL = os.getenv("RPC_URL")

if LANDLORD_ADDRESS is None:
    raise Exception("LANDLORD_ADDRESS is None")
