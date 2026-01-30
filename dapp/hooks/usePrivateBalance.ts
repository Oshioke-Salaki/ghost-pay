import { useEffect, useState, useCallback } from "react";
import { formatUnits } from "ethers";
import { TONGO_CONTRACTS } from "@/lib/tongoData";

type UsePrivateBalanceArgs = {
  tongoAccounts?: Record<
    string,
    {
      state: () => Promise<{ balance: bigint }>;
    }
  >;
  conversionRates?: Record<string, bigint>;
  pollInterval?: number;
};

export function usePrivateBalance({
  tongoAccounts,
  conversionRates,
  pollInterval = 10_000,
}: UsePrivateBalanceArgs) {
  // Store balances as a map: { "STRK": "120.5", "USDC": "5000.0" }
  const [privateBalances, setPrivateBalances] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, unknown>>({});

  const fetchPrivateBalances = useCallback(async () => {
    if (!tongoAccounts || Object.keys(tongoAccounts).length === 0) return;
    if (!conversionRates) return;

    setLoading(true);
    setErrors({});

    const newBalances: Record<string, string> = {};
    const newErrors: Record<string, unknown> = {};

    try {
      // Parallel fetch for all tokens
      await Promise.all(
        Object.entries(tongoAccounts).map(async ([symbol, account]) => {
          try {
            const state = await account.state();
            const rate = conversionRates[symbol];

            if (rate) {
              const bal = state.balance * rate;
              // @ts-ignore
              const decimals = TONGO_CONTRACTS.mainnet[symbol]?.decimals || 18;
              newBalances[symbol] = formatUnits(bal, decimals);
            } else {
              newBalances[symbol] = "0.0"; // Fallback if no rate found
            }
          } catch (e) {
            console.error(`Failed to fetch balance for ${symbol}:`, e);
            newErrors[symbol] = e;
          }
        }),
      );

      setPrivateBalances((prev) => ({ ...prev, ...newBalances }));
      setErrors(newErrors);
    } catch (e) {
      console.error("Global fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, [tongoAccounts, conversionRates]);

  useEffect(() => {
    if (!tongoAccounts || !conversionRates) return;

    fetchPrivateBalances();
    const interval = setInterval(fetchPrivateBalances, pollInterval);

    return () => clearInterval(interval);
  }, [fetchPrivateBalances, pollInterval, tongoAccounts, conversionRates]);

  return {
    privateBalances,
    loadingPrivateBalance: loading,
    refetchPrivateBalances: fetchPrivateBalances,
    errors,
  };
}
