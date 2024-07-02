import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  const ContractFactory = await ethers.getContractFactory(
    "ShutterToken",
    signer,
  );
  const Contract = await ContractFactory.deploy();
  await Contract.deployed();

  console.log("Shutter Token deployed to:", Contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
