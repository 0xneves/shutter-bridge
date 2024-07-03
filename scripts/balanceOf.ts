import { ethers } from "hardhat";

/// @dev This script checks the balance of the user on both Sepolia and Chiado
/// Usage `yarn balances`
async function main() {
  const shutterTokenAddressSepolia = process.env.SHUTTER_TOKEN_SEPOLIA!;
  const shutterTokenAddressChiado = process.env.SHUTTER_TOKEN_SEPOLIA!;

  const sepolia = new ethers.providers.JsonRpcProvider(
    process.env.SEPOLIA_RPC_URL,
  );
  const signerSepolia = new ethers.Wallet(
    process.env.DEPLOYER_PRIVATE_KEY!,
    sepolia,
  );

  const chiado = new ethers.providers.JsonRpcProvider(
    process.env.CHIADO_RPC_URL,
  );
  const signerChiado = new ethers.Wallet(
    process.env.DEPLOYER_PRIVATE_KEY!,
    chiado,
  );

  const ShutterTokenSepolia = await ethers.getContractAt(
    "ShutterToken",
    shutterTokenAddressSepolia,
    signerSepolia,
  );

  const ShutterTokenChiado = await ethers.getContractAt(
    "ShutterToken",
    shutterTokenAddressChiado,
    signerChiado,
  );

  const balanceSepolia = await ShutterTokenSepolia.balanceOf(
    signerSepolia.address,
  );
  console.log(
    "Signer's balance on Sepolia is",
    ethers.utils.formatEther(balanceSepolia),
  );

  const balanceChiado = await ShutterTokenChiado.balanceOf(
    signerChiado.address,
  );
  console.log(
    "Signer's balance on Chiado is",
    ethers.utils.formatEther(balanceChiado),
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
