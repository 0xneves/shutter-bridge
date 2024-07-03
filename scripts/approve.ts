import { ethers } from "hardhat";

/// @dev This script approvaes the OmniBridge contract to spend the ShutterToken
/// tokens on behalf of the user.
/// Usage `yarn approve`
async function main() {
  const [signer] = await ethers.getSigners();

  const shutterTokenAddress = process.env.SHUTTER_TOKEN_SEPOLIA!;
  const omniBridgeAddress = "0x63e47c5e3303dddcaf3b404b1ccf9eb633652e9e";

  const ShutterToken = await ethers.getContractAt(
    "ShutterToken",
    shutterTokenAddress,
    signer,
  );

  /// network may require manual gas price settings
  const tx0 = await ShutterToken.approve(
    omniBridgeAddress,
    ethers.constants.MaxUint256,
    /// uncomment the following lines to set the gas price manually
    /// the value is arguably high because nodes are wreid atm
    {
      // maxPriorityFeePerGas: ethers.utils.parseUnits("30", "gwei"),
      // maxFeePerGas: ethers.utils.parseUnits("450", "gwei"),
    },
  );
  await tx0.wait();
  console.log("Approved OmniBridge to spend $SHU at tx", tx0.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
