import { ethers } from "hardhat";
import relayTokensABI from "./utils/abi/relayTokens.json";

/// @dev This script relays the ShutterToken tokens to the Chiado network
/// Usage `yarn relay --network sepolia`
async function main() {
  const [signer] = await ethers.getSigners();

  const shutterTokenAddress = process.env.SHUTTER_TOKEN_SEPOLIA!;
  const omniBridgeAddress = "0x63E47C5e3303DDDCaF3b404B1CCf9Eb633652e9e";

  const OmniBridge = await ethers.getContractAt(
    relayTokensABI,
    omniBridgeAddress,
    signer,
  );

  const gas = await OmniBridge.estimateGas.relayTokens(
    shutterTokenAddress,
    signer.address,
    ethers.utils.parseEther("1"),
  );

  /// @dev Watch for stuck transactions on Sepolia, it might ask you for higher
  /// gas but you can force the transactions to go through by creating a new
  /// transaction directly in your wallet. Any transactions that were stuck will
  /// go through all at once. Something wreid going on with the nodes atm.
  /// Recommend you using the alchemy sdk directly by calling `yarn relay2`.
  const tx0 = await OmniBridge.relayTokens(
    shutterTokenAddress,
    signer.address,
    ethers.utils.parseEther("1"),
    /// usncomment the following lines to set the gas price manually
    {
      gasLimit: gas,
      // maxPriorityFeePerGas: ethers.utils.parseUnits("30", "gwei"),
      // maxFeePerGas: ethers.utils.parseUnits("450", "gwei"),
    },
  );

  await tx0.wait();
  console.log("Tokens relayed to Chiado at tx", tx0.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
