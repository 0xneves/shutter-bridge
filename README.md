# shutter-bridge

This repo locks underlying $SHU tokens on Ethereum and mints synthetic tokens in Gnosis Chain and the other way around using the Gnosis OmniBridge.

#### What's inside?

- [OmniBridge](https://docs.gnosischain.com/bridges/About%20Token%20Bridges/omnibridge)
- [Proposal to deploy SHU on Gnosis](https://shutternetwork.discourse.group/t/final-proposal-to-deploy-a-shu-usdc-pool-in-swapr-v3-on-gnosis-chain/441)
- [Github Issue](https://github.com/blockful-io/shutter-bridge/issues/2)
- [Shutter Token on Sepolia](https://sepolia.etherscan.io/address/0x2951115ab28ada82b34797a12f3eff061c8645bc)
- [Shutter Token on Chiado](https://gnosis-chiado.blockscout.com/address/0x9f1fbDB40FC5009F0C057925fcDe4105688B8074?tab=txs)

## Getting Started

Start by installing the dependencies:

```bash
$ yarn
```

Then set the environment variables by copying the `.env.example` file and removing the `.example` extension, then fill in the values:

- **RPC URLs:** You can try public RPCs but they might not work properly. Try using [Alchemy](https://www.alchemy.com/) or [Infura](https://infura.io/) for this.
- **PRIVATE KEY:** The private key of the account that will be used to deploy the contracts.
- **ALCHEMY KEY:** The Alchemy key is an alternative
- **ETHERSCAN KEY:** Optional but recommended. Used to verify the contracts on Etherscan.
- **SHUTTER TOKEN ADDRESS:** The address of the Shutter Token contract deployed on each chain.

## Deploying the contracts

You can choose between deploying a new contract or use the existing contract that were previsouly deployed by Blockful. The contract addresses were already set in the `.env.sample` file. you can directly mint new tokens by calling the `mint` script.

### Deploy your own Shutter Token on Sepolia network by calling:

```bash
$ yarn deploy --network sepolia
```

The contract should be deployed on Sepolia. This is because the Gnosis bridge only has support for Ethereum<>Gnosis and Sepolia<>Chiado at the moment. After deploying the Shutter Token, you need to set the `SHUTTER_TOKEN_SEPOLIA` in the `.env` file.

Optionally, you can verify the contract on Etherscan with:

```bash
$ npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <OWNER_ADDRESS>
```

### For the deployment on the Chiado network, you need to call:

Can only be used after the Sepolia contract has been deployed.

```bash
$ yarn relay --network sepolia
```

This will relay the tokens from the Sepolia network to the Chiado network. The bridge works by locking the tokens on one side and minting them on the other side. When the tokens are being minted for the first time, the mediator contract will deploy an ERC677 proxy for a Permittable ERC20 token. The contract will only be deployed for the first time and the proxy will be used to mint the tokens on the other side from now on.

You will be needing to fetch the TX hash on the console and navigate to the Chiado Blockscout to fetch the contract that was deployed. Then change the value for the `SHUTTER_TOKEN_CHIADO` in the `.env` file.

## Bridging tokens from Sepolia to Chiado

Before bridging the tokens, make sure that you have a valid ERC20 set in `SHUTTER_TOKEN_SEPOLIA` in the `.env` file.

First you must approve the tokens to be bridged by calling the `approve` script. It will approve the mediator contract to spend the tokens on your behalf. The mediator contract is also known as the OmniBridge contract.

```bash
$ yarn approve --network sepolia
```

You can bridge tokens by calling the `relay` script. This will lock the tokens on one side and mint them on the other side.

```bash
$ yarn relay --network sepolia
```

**NOTICE:** Sepolia network is demonstrating strange behavior lately, with a lot of fluctiations in the gas fees and nodes stucking your transactions. If you are facing this issue, try adjusting the manual gas fees by uncommenting the `maxFeePerGas` and `maxPriorityFeePerGas` in the function. If the issue persist you can try using Alchemy SDK to send raw transactions. If the issue persists you can copy the data on the console of the resulting transaction and send it manually via browser wallet.

This method require the `ALCHEMY_API_KEY` to be set in the `.env` file.

```bash
$ yarn relay2
```

## Bridging tokens from Chiado to Sepolia

Before bridging the tokens, make sure that you have a valid ERC20 set in `SHUTTER_TOKEN_CHIADO` in the `.env` file.

You can bridge tokens by calling the `transferAndCall` script directly in the ERC677 token contract. This will burn the tokens on one side and unlock them on the other side.

```bash
$ yarn transferAndCall --network chiado
```

## Minting more tokens on Sepolia

You can mint more tokens on Sepolia by calling the `mint` script. But you cant mint more tokens on the Chiado network. The tokens are minted on the Sepolia network and then relayed to the Chiado network.

```bash
$ yarn mint --network sepolia
```

## License

This project is licensed under MIT.
