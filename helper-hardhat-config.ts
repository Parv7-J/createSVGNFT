import fs from "node:fs";

const developmentChains = ["hardhat", "localhost"];

const lowSVG = fs.readFileSync("./svg/low.svg", { encoding: "utf-8" });
const highSVG = fs.readFileSync("./svg/high.svg", { encoding: "utf-8" });

interface NetworkConfigItem {
  name: string;
  nftName: string;
  nftSymbol: string;
  decimals: number;
  initialAnswer: number;
  aggregatorAddress: string;
  lowSVG: string;
  highSVG: string;
}

interface NetworkConfig {
  [chainId: number]: NetworkConfigItem;
}

const networkConfig: NetworkConfig = {
  11155111: {
    name: "sepolia",
    nftName: "EldenRing NFT",
    nftSymbol: "ER",
    decimals: 0,
    initialAnswer: 0,
    aggregatorAddress: "",
    lowSVG,
    highSVG,
  },
  31337: {
    name: "localhost",
    nftName: "EldenRing NFT",
    nftSymbol: "ER",
    decimals: 18,
    initialAnswer: 2500,
    aggregatorAddress: "",
    lowSVG,
    highSVG,
  },
};

export { networkConfig, developmentChains };
