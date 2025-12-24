import { constants } from "starknet";

export type Network = "mainnet" | "sepolia";

export const TONGO_CONTRACTS = {
  mainnet: {
    STRK: {
      address:
        "0x3a542d7eb73b3e33a2c54e9827ec17a6365e289ec35ccc94dde97950d9db498",
      erc20:
        "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
      rate: "50000000000000000",
    },
    ETH: {
      address:
        "0x276e11a5428f6de18a38b7abc1d60abc75ce20aa3a925e20a393fcec9104f89",
      erc20:
        "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
      rate: "3000000000000",
    },
  },
  sepolia: {
    STRK: {
      address: "0x408163bfcfc2d76f34b444cb55e09dace5905cf84c0884e4637c2c0f06", // Correct Sepolia Addr
      erc20:
        "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
      rate: "50000000000000000",
    },
    ETH: {
      address: "0x2cf0dc1d9e8c7731353dd15e6f2f22140120ef2d27116b982fa4fed87f",
      erc20: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e0",
      rate: "3000000000000",
    },
  },
};

export const getCurrentNetwork = (chainId?: string): Network => {
  // Check against the string constant for Mainnet
  if (chainId === constants.StarknetChainId.SN_MAIN) return "mainnet";
  // Default to Sepolia for safety
  return "sepolia";
};
