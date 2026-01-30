"use client";
import React, { useCallback } from "react";

import { mainnet, Chain } from "@starknet-react/chains";
import {
  StarknetConfig,
  argent,
  braavos,
  useInjectedConnectors,
  voyager,
  jsonRpcProvider,
  paymasterRpcProvider,
} from "@starknet-react/core";

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: "always",
  });

  const rpc = useCallback((chain: Chain) => {
    return {
      nodeUrl:
        "https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_8/L-VhhXxIK2EZXjZfcTn-q5tY4u_GHkoc",
    };
  }, []);

  const provider = jsonRpcProvider({ rpc });

  return (
    <StarknetConfig
    paymasterProvider={paymasterRpcProvider({
        rpc: () => {
          return {
            nodeUrl: "https://starknet.paymaster.avnu.fi",
            headers: {
              "x-paymaster-api-key":
                process.env.NEXT_PUBLIC_PAYMASTER_API ?? "",
            },
          };
        },
      })}
      chains={[mainnet]}
      provider={provider}
      connectors={connectors}
      autoConnect={true}
      explorer={voyager}
    >
      {children}
    </StarknetConfig>
  );
}
