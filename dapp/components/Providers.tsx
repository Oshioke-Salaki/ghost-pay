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
} from "@starknet-react/core";

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [argent(), braavos()],
    // Hide recommended connectors if the user has any connector installed.
    includeRecommended: "onlyIfNoConnectors",
    // Randomize the order of the connectors.
    order: "alphabetical",
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
      chains={[mainnet]}
      provider={provider}
      connectors={connectors ?? []}
      explorer={voyager}
    >
      {children}
    </StarknetConfig>
  );
}
