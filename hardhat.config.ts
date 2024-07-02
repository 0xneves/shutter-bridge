import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: `${process.env.SEPOLIA_RPC_URL}`,
      accounts: [`${process.env.DEPLOYER_PRIVATE_KEY}`],
    },
    ethereum: {
      url: `${process.env.ETHEREUM_RPC_URL}`,
      accounts: [`${process.env.DEPLOYER_PRIVATE_KEY}`],
    },
    chiado: {
      url: `${process.env.CHIADO_RPC_URL}`,
      accounts: [`${process.env.DEPLOYER_PRIVATE_KEY}`],
    },
    gnosis: {
      url: `${process.env.GNOSIS_RPC_URL}`,
      accounts: [`${process.env.DEPLOYER_PRIVATE_KEY}`],
    },
  },
  defaultNetwork: "hardhat",
  gasReporter: {
    enabled: true,
  },
};

export default config;
