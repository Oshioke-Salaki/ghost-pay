import { useState, useCallback, useMemo, useEffect } from "react";
import { useAccount } from "@starknet-react/core";
import { Account as TongoAccount } from "@fatsolutions/tongo-sdk";
import { hash, constants, ec, RpcProvider } from "starknet";
import { TONGO_CONTRACTS } from "@/lib/tongoData";

import { useTongoStore } from "@/store/tongoStore";

export const useTongoAccount = () => {
  const { account, address } = useAccount();

  // Access global store state
  const {
    tongoAccounts,
    setTongoAccounts,
    conversionRates,
    setConversionRates,
    isInitializing,
    setIsInitializing,
  } = useTongoStore();

  const tongoProvider = useMemo(() => {
    return new RpcProvider({
      nodeUrl:
        "https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_7/L-VhhXxIK2EZXjZfcTn-q5tY4u_GHkoc",
    });
  }, []);

  const initializeTongo = useCallback(async () => {
    if (!account || !address || !tongoProvider) return;
    setIsInitializing(true);

    try {
      // 1. Sign Message for Deterministic Key (Once for all tokens)
      const signature = await account.signMessage({
        types: {
          StarkNetDomain: [
            { name: "name", type: "felt" },
            { name: "version", type: "felt" },
            { name: "chainId", type: "felt" },
          ],
          Message: [{ name: "action", type: "felt" }],
        },
        primaryType: "Message",
        domain: {
          name: "GhostPay Tongo Identity",
          version: "1",
          chainId: constants.StarknetChainId.SN_MAIN, // Force Mainnet Chain ID
        },
        message: {
          action: "login",
        },
      });

      // 2. Derive Key
      let r, s;
      if (Array.isArray(signature)) {
        r = signature[0];
        s = signature[1];
      } else {
        // @ts-ignore
        r = signature.r;
        s = signature.s;
      }

      let seed = hash.computePoseidonHash(r, s);
      if (typeof seed === "string" && !seed.startsWith("0x")) {
        seed = "0x" + seed;
      }

      let privateKey = ec.starkCurve.grindKey(seed);
      if (typeof privateKey === "string" && !privateKey.startsWith("0x")) {
        privateKey = "0x" + privateKey;
      }

      // 3. Initialize ALL Token Accounts
      const newAccounts: Record<string, TongoAccount> = {};
      const newRates: Record<string, bigint> = {};
      const tokens = TONGO_CONTRACTS["mainnet"]; // Hardcoded to Mainnet per requirement

      for (const [symbol, contractInfo] of Object.entries(tokens)) {
        // Store Rate
        newRates[symbol] = BigInt(contractInfo.rate);

        // Init SDK Instance
        newAccounts[symbol] = new TongoAccount(
          privateKey,
          contractInfo.address,
          tongoProvider,
        );
      }

      setConversionRates(newRates);
      setTongoAccounts(newAccounts);

      return newAccounts;
    } catch (err: any) {
      console.error("Failed to init Tongo:", err);
      alert(`Initialization Error: ${err.message}`);
    } finally {
      setIsInitializing(false);
    }
  }, [account, address, tongoProvider]);

  // Helper to get a specific account instance
  const getAccount = useCallback(
    (symbol: string) => {
      return tongoAccounts[symbol] || null;
    },
    [tongoAccounts],
  );

  return {
    tongoAccounts,
    getAccount,
    initializeTongo,
    isInitializing,
    conversionRates,
    // Keep legacy single-account return for gradual refactor if needed,
    // but better to break it to force updates:
    // tongoAccount: tongoAccounts["STRK"] // Optional: remove this to enforce new pattern
  };
};
