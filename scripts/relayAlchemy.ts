import { ethers } from "hardhat";
import { Alchemy, Network, Wallet, Utils } from "alchemy-sdk";
import relayTokensABI from "./utils/abi/relayTokens.json";

const { ALCHEMY_API_KEY, DEPLOYER_PRIVATE_KEY } = process.env;

if (!DEPLOYER_PRIVATE_KEY) {
  throw new Error("DEPLOYER_PRIVATE_KEY is not set");
}

if (!ALCHEMY_API_KEY) {
  throw new Error("ALCHEMY_API_KEY is not set");
}

const settings = {
  apiKey: ALCHEMY_API_KEY,
  network: Network.ETH_SEPOLIA,
};
const alchemy = new Alchemy(settings);

let wallet = new Wallet(DEPLOYER_PRIVATE_KEY);

/// @dev Testing the relayTokens function of the OmniBridge contract
/// via Alchemy SDK because transactions were getting stuck on the
/// nodes.
async function main() {
  const [signer] = await ethers.getSigners();

  const shutterTokenAddress = "0x031219C4Db62C9403A243796C6CD59851038b5Ba";
  const omniBridgeAddress = "0x63E47C5e3303DDDCaF3b404B1CCf9Eb633652e9e";

  const nonce = await alchemy.core.getTransactionCount(
    signer.address,
    "latest",
  );

  const OmniBridge = await ethers.getContractAt(
    relayTokensABI,
    omniBridgeAddress,
    signer,
  );

  const data = OmniBridge.interface.encodeFunctionData("relayTokens", [
    shutterTokenAddress,
    signer.address,
    ethers.utils.parseEther("1"),
  ]);

  console.log("Data \n", data);

  let transaction = {
    to: omniBridgeAddress,
    value: 0,
    data: data,
    gasLimit: "300000",
    maxPriorityFeePerGas: Utils.parseUnits("30", "gwei"),
    maxFeePerGas: Utils.parseUnits("450", "gwei"),
    nonce: nonce,
    type: 2,
    chainId: 11155111,
  };

  let rawTransaction = await wallet.signTransaction(transaction);
  let tx = await alchemy.core.sendTransaction(rawTransaction);
  await tx.wait();
  console.log("Tokens relayed to Chiado at tx", tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
