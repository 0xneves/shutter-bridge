import { ethers } from "hardhat";
import { Alchemy, Network, Wallet, Utils } from "alchemy-sdk";
import relayTokensABI from "./utils/abi/relayTokens.json";

const { ALCHEMY_API_KEY, DEPLOYER_PRIVATE_KEY } = process.env;

const settings = {
  apiKey: ALCHEMY_API_KEY!,
  network: Network.ETH_SEPOLIA,
};
const alchemy = new Alchemy(settings);
let wallet = new Wallet(DEPLOYER_PRIVATE_KEY!);

/// @dev Calls the relayTokens function of the OmniBridge contract
/// via Alchemy SDK because transactions were getting stuck on the
/// nodes when using hardhat's with ethers.js. You might need to adjust
/// the gas settings manually deppending on the network conditions.
/// Use `yarn relay2` to run this script.
async function main() {
  const [signer] = await ethers.getSigners();

  /// you need to deploy your own Shutter Token first by calling `yarn deploy`
  /// and placing the resulting contract address here
  const shutterTokenAddress = process.env.SHUTTER_TOKEN_SEPOLIA!;
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

  /// encode the relayTokens function selector with the parameters
  const data = OmniBridge.interface.encodeFunctionData("relayTokens", [
    shutterTokenAddress,
    signer.address,
    ethers.utils.parseEther("1"),
  ]);

  /// print the data to be sent, you can also manually send this data
  /// via wallet by placing in the hex field of a transaction
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
