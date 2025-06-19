import { vars, type HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const INFURA_PRIVATE_KEY = vars.get("INFURA_API_KEY");
const ETHERSCAN_API_KEY = vars.get("ETHERSCAN_API_KEY");
const SEPOLIA_PRIVATE_KEY = vars.get("SEPOLIA_PRIVATE_KEY");
const FUNDER_PRIVATE_KEY = vars.get("FUNDER_PRIVATE_KEY");
const COINMARKETCAP_API_KEY = vars.get("COINMARKETCAP_API_KEY");

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      chainId: 31337,
      url: "http://127.0.0.1:8545/",
    },
    sepolia: {
      chainId: 11155111,
      url: `https://sepolia.infura.io/v3/${INFURA_PRIVATE_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY, FUNDER_PRIVATE_KEY],
    },
  },
  mocha: {
    timeout: 10000,
    reporterOptions: {
      maxDiffSize: 0,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
    },
  },
  ignition: {
    requiredConfirmations: 1,
  },
  gasReporter: {
    enabled: true,
    currency: "INR",
    coinmarketcap: COINMARKETCAP_API_KEY,
    gasPriceApi: ETHERSCAN_API_KEY,
  },
};

export default config;
