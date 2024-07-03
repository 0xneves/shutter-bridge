import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();

  const shutterTokenAddress = "0x031219C4Db62C9403A243796C6CD59851038b5Ba";
  const omniBridgeAddress = "0x63e47c5e3303dddcaf3b404b1ccf9eb633652e9e";

  const ShutterToken = await ethers.getContractAt(
    "ShutterToken",
    shutterTokenAddress,
    signer,
  );

  const tx0 = await ShutterToken.approve(
    omniBridgeAddress,
    ethers.constants.MaxUint256,
    {
      // maxPriorityFeePerGas: ethers.utils.parseUnits("1.5", "gwei"),
      // maxFeePerGas: ethers.utils.parseUnits("10", "gwei"),
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
