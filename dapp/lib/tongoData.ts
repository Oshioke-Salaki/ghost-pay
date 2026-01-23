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
    USDC: {
      address:
        "0x026f79017c3c382148832c6ae50c22502e66f7a2f81ccbdb9e1377af31859d3a",
      erc20:
        "0x033068F6539f8e6e6b131e6B2B814e6c34A5224bC66947c47DaB9dFeE93b35fb",
      rate: "10000",
    },
    USDT: {
      address:
        "0x659c62ba8bc3ac92ace36ba190b350451d0c767aa973dd63b042b59cc065da0",
      erc20:
        "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8",
      rate: "10000",
    },
    WBTC: {
      address:
        "0x6d82c8c467eac77f880a1d5a090e0e0094a557bf67d74b98ba1881200750e27",
      erc20:
        "0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac",
      rate: "10",
    },
  },
  sepolia: {
    STRK: {
      address: "0x408163bfcfc2d76f34b444cb55e09dace5905cf84c0884e4637c2c0f06",
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
