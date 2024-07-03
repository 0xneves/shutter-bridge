import { ethers } from "hardhat";

async function main() {
  const shutterTokenAddressSepolia =
    "0x031219C4Db62C9403A243796C6CD59851038b5Ba";
  const shutterTokenAddressChiado =
    "0x991094C6b570A3eBDA9D1EaE13b086d0becC54B5";

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
