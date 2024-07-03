import { ethers } from "hardhat";
import transferAndCallABI from "./utils/abi/transferAndCall.json";

/// @dev This script burns the synthetic ShutterToken tokens on the
/// Chiado network and sends a message to the OmniBridge to transfer
/// the locked tokens that are on the Sepolia bridge contract
/// You don't need to approve the tokens for this transfer
/// Usage `yarn burn`
async function main() {
  const [signer] = await ethers.getSigners();

  const shutterTokenAddress = "0x991094C6b570A3eBDA9D1EaE13b086d0becC54B5";
  const omniBridgeAddress = "0x82f63B9730f419CbfEEF10d58a522203838d74c8";

  const ShutterToken = await ethers.getContractAt(
    transferAndCallABI,
    shutterTokenAddress,
    signer,
  );

  /// the third argument is the address of the recipient on the other chain
  /// encoded as bytes type, we use solidityPack to encode the address
  const encodedAddress = ethers.utils.solidityPack(
    ["address"],
    [signer.address],
  );

  const gas = await ShutterToken.estimateGas.transferAndCall(
    omniBridgeAddress,
    ethers.utils.parseEther("1"),
    encodedAddress,
  );

  const tx0 = await ShutterToken.transferAndCall(
    omniBridgeAddress,
    ethers.utils.parseEther("1"),
    encodedAddress,
    /// is inlikely that you will need to set the gas price manually
    /// on chiado/gnosis, gas problems are common on sepolia/matic
    {
      gasLimit: gas,
      // maxPriorityFeePerGas: ethers.utils.parseUnits("30", "gwei"),
      // maxFeePerGas: ethers.utils.parseUnits("450", "gwei"),
    },
  );

  await tx0.wait();
  console.log("Tokens burned in Chiado at tx", tx0.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
