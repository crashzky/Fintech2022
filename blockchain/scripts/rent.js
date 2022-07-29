const hre = require("hardhat");

const domain = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "verifyingContract", type: "address" },
];

const rental_permit = [
  { name: "deadline", type: "uint256" },
  { name: "tenant", type: "address" },
  { name: "rentalRate", type: "uint256" },
  { name: "billingPeriodDuration", type: "uint256" },
  { name: "billingsCount", type: "uint256" },
];

async function singMessage(provider, signer, message, contractAddress) {
  const domainData = {
    name: "Rental Agreement",
    version: "1.0",
    verifyingContract: contractAddress,
  };

  const data = JSON.stringify({
    types: {
      EIP712Domain: domain,
      RentalPermit: rental_permit,
    },
    domain: domainData,
    primaryType: "RentalPermit",
    message,
  });

  const result = await provider.send("eth_signTypedData_v4", [signer, data]);
  return result;
}

async function main() {
  const signers = await hre.ethers.getSigners();
  const landlord = signers[0];
  const tenant = signers[1];

  const message = {
    deadline: 1679092093,
    tenant: await tenant.getAddress(),
    rentalRate: 100,
    billingPeriodDuration: 60,
    billingsCount: 2,
  };

  var sign = await singMessage(
    hre.ethers.provider,
    await landlord.getAddress(),
    message,
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );

  sign = sign.substring(2);
  const r = "0x" + sign.substring(0, 64);
  const s = "0x" + sign.substring(64, 128);
  const v = parseInt(sign.substring(128, 130), 16);

  const contract = await hre.ethers.getContractAt(
    "RentalAgreement",
    "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    tenant
  );

  console.log(
    await contract.rent(
      message.deadline,
      message.tenant,
      message.rentalRate,
      message.billingPeriodDuration,
      message.billingsCount,
      { v, r, s },
      { value: message.rentalRate }
    )
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
