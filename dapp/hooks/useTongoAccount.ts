import { useState, useCallback, useMemo, useEffect } from "react";
import { useAccount } from "@starknet-react/core";
import { Account as TongoAccount } from "@fatsolutions/tongo-sdk";
import { hash, constants, ec, RpcProvider } from "starknet";
import { TONGO_CONTRACTS } from "@/lib/tongoData";

export const useTongoAccount = () => {
  const { account, address } = useAccount();

  // Registry of Tongo Accounts: Token Symbol -> TongoAccount Instance
  const [tongoAccounts, setTongoAccounts] = useState<
    Record<string, TongoAccount>
  >({});
  const [isInitializing, setIsInitializing] = useState(false);

  // Rate Registry: Token Symbol -> BigInt Rate
  const [conversionRates, setConversionRates] = useState<
    Record<string, bigint>
  >({});

  const tongoProvider = useMemo(() => {
    return new RpcProvider({
      nodeUrl:
        "https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_7/L-VhhXxIK2EZXjZfcTn-q5tY4u_GHkoc",
    });
  }, []);

  // Debug: Check provider connection
  useEffect(() => {
    if (tongoProvider) {
      tongoProvider
        .getChainId()
        .then((chainId) => {
          console.log("🔌 Tongo Provider Connected to Chain:", chainId);
        })
        .catch((e) => console.error("🔌 Tongo Provider Connection Error:", e));
    }
  }, [tongoProvider]);

  const initializeTongo = useCallback(async () => {
    if (!account || !address || !tongoProvider) return;
    setIsInitializing(true);

    try {
      console.log(`🔌 Tongo Init: Forcing MAINNET connection`);

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
          action: "ghostpay-login-v1",
          wallet: address,
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
        console.log(
          `🎯 Init Tongo for [${symbol}]: ${contractInfo.address}`
        );

        // Store Rate
        newRates[symbol] = BigInt(contractInfo.rate);

        // Init SDK Instance
        newAccounts[symbol] = new TongoAccount(
          privateKey,
          contractInfo.address,
          tongoProvider
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
    [tongoAccounts]
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
