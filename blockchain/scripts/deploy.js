const hre = require("hardhat");

async function main() {
  const Contract = await hre.ethers.getContractFactory("RentalAgreement");
  const contract1 = await Contract.deploy(1);
  const contract2 = await Contract.deploy(2);
  const contract3 = await Contract.deploy(3);
  const contract4 = await Contract.deploy(4);

  await contract1.deployed();
  await contract2.deployed();
  await contract3.deployed();
  await contract4.deployed();

  console.log("Contract 1 deployed to:", contract1.address);
  console.log("Contract 2 deployed to:", contract2.address);
  console.log("Contract 3 deployed to:", contract3.address);
  console.log("Contract 4 deployed to:", contract4.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
