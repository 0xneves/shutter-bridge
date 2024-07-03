import { ethers } from "hardhat";

/// @dev This script deploys the ShutterToken contract for the signer
async function main() {
  const [signer] = await ethers.getSigners();
  const ContractFactory = await ethers.getContractFactory(
    "ShutterToken",
    signer,
  );
  const Contract = await ContractFactory.deploy(signer.address);
  await Contract.deployed();

  const currentBalance = await Contract.balanceOf(signer.address);

  console.log("Deploying Shutter Token as ", signer.address);
  console.log("Shutter Token deployed to:", Contract.address);
  console.log(
    "Current $SHU balance of deployer:",
    ethers.utils.formatEther(currentBalance),
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
