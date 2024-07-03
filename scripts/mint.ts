import { ethers } from "hardhat";

/// @dev This script mints ShutterToken tokens to the caller. It mints 1e18 tokens.
/// Usage `yarn mint`
async function main() {
  const [signer] = await ethers.getSigners();

  let shutterTokenAddress;

  if ((await ethers.provider.getNetwork()).chainId === 11155111) {
    shutterTokenAddress = process.env.SHUTTER_TOKEN_SEPOLIA!;
  } else if ((await ethers.provider.getNetwork()).chainId === 10200) {
    shutterTokenAddress = process.env.SHUTTER_TOKEN_CHIADO!;
  } else {
    console.log(
      "This script is only meant to be run on the Sepolia network and Chiado network",
    );
    process.exit(1);
  }

  const ShutterToken = await ethers.getContractAt(
    "ShutterToken",
    shutterTokenAddress,
    signer,
  );

  /// network may require manual gas price settings
  const tx0 = await ShutterToken.mint(
    /// uncomment the following lines to set the gas price manually
    /// the value is arguably high because nodes are wreid atm
    {
      // maxPriorityFeePerGas: ethers.utils.parseUnits("30", "gwei"),
      // maxFeePerGas: ethers.utils.parseUnits("450", "gwei"),
    },
  );
  await tx0.wait();
  console.log("Minted 1e18 Shutter Tokens to", signer.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
