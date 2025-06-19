import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core/dist/src/types/module";
import hre from "hardhat";
import {
  developmentChains,
  networkConfig as allNetworkConfig,
} from "../../helper-hardhat-config";

type DynamicSvgNftResult = {
  dynamicSvgNft: NamedArtifactContractDeploymentFuture<"DynamicSvgNft">;
  mockV3Aggregator?: NamedArtifactContractDeploymentFuture<"MockV3Aggregator">;
};

export default buildModule("DynamicSvgNftModule", (m): DynamicSvgNftResult => {
  let mockV3Aggregator:
    | NamedArtifactContractDeploymentFuture<"MockV3Aggregator">
    | undefined = undefined;
  let aggregatorAddress:
    | NamedArtifactContractDeploymentFuture<"MockV3Aggregator">
    | string;

  const chainId = hre.network.config.chainId!;
  const networkConfig = allNetworkConfig[chainId];

  const isLocal = developmentChains.includes(hre.network.name);

  if (isLocal) {
    mockV3Aggregator = m.contract("MockV3Aggregator", [
      networkConfig.decimals,
      networkConfig.initialAnswer,
    ]);
    aggregatorAddress = mockV3Aggregator;
  } else {
    aggregatorAddress = networkConfig.aggregatorAddress;
  }

  const dynamicSvgNft = m.contract("DynamicSvgNft", [
    networkConfig.nftName,
    networkConfig.nftSymbol,
    aggregatorAddress!,
    networkConfig.highSVG,
    networkConfig.lowSVG,
  ]);

  const result: DynamicSvgNftResult = { dynamicSvgNft };

  if (isLocal) {
    result.mockV3Aggregator = mockV3Aggregator;
  }

  return result;
});
