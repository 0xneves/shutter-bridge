import { ethers } from "hardhat";
import relayTokensABI from "./utils/abi/relayTokens.json";

async function main() {
  const [signer] = await ethers.getSigners();

  const shutterTokenAddress = "0x031219C4Db62C9403A243796C6CD59851038b5Ba";
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

  const tx0 = await OmniBridge.relayTokens(
    shutterTokenAddress,
    signer.address,
    ethers.utils.parseEther("1"),
    {
      gasLimit: gas,
      // maxPriorityFeePerGas: ethers.utils.parseUnits("1.5", "gwei"),
      // maxFeePerGas: ethers.utils.parseUnits("10", "gwei"),
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
