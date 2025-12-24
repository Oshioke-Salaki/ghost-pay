import { useState, useCallback, useMemo, useEffect } from "react";
import { useAccount } from "@starknet-react/core";
import { Account as TongoAccount } from "@fatsolutions/tongo-sdk";
import { hash, constants, ec, RpcProvider } from "starknet";
import { TONGO_CONTRACTS } from "@/lib/tongoData";

export const useTongoAccount = () => {
  const { account, address } = useAccount();

  const [tongoAccount, setTongoAccount] = useState<TongoAccount | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  // Default to Mainnet STRK rate initially so it's never zero
  const [conversionRate, setConversionRate] = useState<bigint>(
    BigInt(TONGO_CONTRACTS["mainnet"]["STRK"].rate)
  );

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

      // 2. Sign Message for Deterministic Key
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

      // 3. Derive Key
      let r, s;
      if (Array.isArray(signature)) {
        r = signature[0];
        s = signature[1];
      } else {
        // @ts-ignore
        r = signature.r;
        s = signature.s;
      }

      // Compute hash of signature components to get a deterministic seed
      let seed = hash.computePoseidonHash(r, s);

      // Ensure seed string has 0x prefix if missing, to prevent BigInt parsing errors
      if (typeof seed === "string" && !seed.startsWith("0x")) {
        seed = "0x" + seed;
      }

      // Ensure the private key is within the curve order using starknet.js utility
      let privateKey = ec.starkCurve.grindKey(seed);

      // Ensure privateKey string has 0x prefix if missing
      if (typeof privateKey === "string" && !privateKey.startsWith("0x")) {
        privateKey = "0x" + privateKey;
      }

      // 4. Select Contract - Hardcoded to Mainnet and STRK
      const contractInfo = TONGO_CONTRACTS["mainnet"]["STRK"];

      if (!contractInfo) {
        throw new Error(`No contract found for token STRK on mainnet`);
      }

      // Update rate state
      setConversionRate(BigInt(contractInfo.rate));

      console.log(
        `🎯 Targeting Tongo Contract: ${contractInfo.address} on mainnet`
      );

      // 5. Initialize SDK with the specific RPC Provider
      const newTongoAccount = new TongoAccount(
        privateKey,
        contractInfo.address,
        tongoProvider
      );

      setTongoAccount(newTongoAccount);
      return newTongoAccount;
    } catch (err: any) {
      console.error("Failed to init Tongo:", err);
      alert(`Initialization Error: ${err.message}`);
    } finally {
      setIsInitializing(false);
    }
  }, [account, address, tongoProvider]);

  return { tongoAccount, initializeTongo, isInitializing, conversionRate };
};
