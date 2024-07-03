import { ethers } from "hardhat";

/// @dev This script is used to generate the data for the approve and transferFrom
/// functions to be used in the Snapshot proposal to move assets on the Gnosis Safe.
/// The transaction should be proposed on the Sepolia testnet and the treasury
/// on Gnosis must be the one to execute the proposal, approving and moving the assets.
async function main() {
  const [signer] = await ethers.getSigners();

  let shutterTokenAddress = "0x031219C4Db62C9403A243796C6CD59851038b5Ba";

  const ShutterToken = await ethers.getContractAt(
    "ShutterToken",
    shutterTokenAddress,
    signer,
  );

  let data;

  data = ShutterToken.interface.encodeFunctionData("approve", [
    "0x9f3e38258b5Df65A23995bc39AC7eC82194ceF65", /// Gnosis safe
    ethers.utils.parseEther("10000"), /// Amount
  ]);
  console.log("Approve \n", data);

  data = ShutterToken.interface.encodeFunctionData("transferFrom", [
    "0x9f3e38258b5Df65A23995bc39AC7eC82194ceF65", /// Gnosis safe
    signer.address, /// Recipient
    ethers.utils.parseEther("10000"), /// Amount
  ]);
  console.log("TransferFrom \n", data);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
