import { useEffect, useState, useCallback } from "react";
import { formatUnits } from "ethers";
type UsePrivateBalanceArgs = {
  tongoAccount?: {
    state: () => Promise<{ balance: bigint }>;
  } | null;
  conversionRate?: bigint;
  pollInterval?: number;
};

export function usePrivateBalance({
  tongoAccount,
  conversionRate,
  pollInterval = 10_000,
}: UsePrivateBalanceArgs) {
  const [privateBalance, setPrivateBalance] = useState<string>("0.0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchPrivateBalance = useCallback(async () => {
    if (!tongoAccount || !conversionRate) return;

    setLoading(true);
    setError(null);

    try {
      const state = await tongoAccount.state();
      const bal = state.balance * conversionRate;
      setPrivateBalance(formatUnits(bal, 18));
    } catch (e) {
      console.error(e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [tongoAccount, conversionRate]);

  useEffect(() => {
    if (!tongoAccount || !conversionRate) return;

    fetchPrivateBalance();
    const interval = setInterval(fetchPrivateBalance, pollInterval);

    return () => clearInterval(interval);
  }, [fetchPrivateBalance, pollInterval, tongoAccount, conversionRate]);

  return {
    privateBalance,
    loadingPrivateBalance: loading,
    refetchPrivateBalance: fetchPrivateBalance,
    error,
  };
}
