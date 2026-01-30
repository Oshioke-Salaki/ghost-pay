import { useMemo } from "react";
import { useAccount, useBalance } from "@starknet-react/core";
import { TONGO_CONTRACTS } from "@/lib/tongoData";
import { useTongoAccount } from "./useTongoAccount";
import { usePrivateBalance } from "./usePrivateBalance";
import { useAvnuPrice } from "./useAvnuPrice";

export type AssetPortfolio = {
  symbol: string;
  publicBalance: number; // formatted number
  privateBalance: number; // formatted number
  price: number;
  publicUsd: number;
  privateUsd: number;
  totalUsd: number;
  formattedPublic: string;
  formattedPrivate: string;
};

type UsePortfolioProps = {
  accounts?: Record<string, any>;
  rates?: Record<string, bigint>;
};

export function usePortfolio(props: UsePortfolioProps = {}) {
  const { address } = useAccount();
  const { tongoAccounts: internalAccounts, conversionRates: internalRates } =
    useTongoAccount();

  const tongoAccounts = props.accounts || internalAccounts;
  const conversionRates = props.rates || internalRates;

  // -- Private Balances --
  const {
    privateBalances,
    loadingPrivateBalance,
    refetchPrivateBalances,
    errors,
  } = usePrivateBalance({
    tongoAccounts,
    conversionRates,
  });

  // -- Tokens --
  // We explicitly list them or map them. Since hooks inside loop are tricky with linters,
  // we will perform the fetch logic in a way that satisfies React rules or use a known list.
  // For V1, we simply hardcode the top assets to ensure safe hook usage.

  // 1. STRK
  const { data: strkData } = useBalance({
    address,
    token: TONGO_CONTRACTS.mainnet.STRK.erc20 as `0x${string}`,
    watch: true,
  });
  const { price: strkPrice } = useAvnuPrice("STRK");

  // 2. ETH
  const { data: ethData } = useBalance({
    address,
    token: TONGO_CONTRACTS.mainnet.ETH.erc20 as `0x${string}`,
    watch: true,
  });
  const { price: ethPrice } = useAvnuPrice("ETH");

  // 3. USDC
  const { data: usdcData } = useBalance({
    address,
    token: TONGO_CONTRACTS.mainnet.USDC.erc20 as `0x${string}`,
    watch: true,
  });
  const { price: usdcPrice } = useAvnuPrice("USDC");

  // 4. USDT
  const { data: usdtData } = useBalance({
    address,
    token: TONGO_CONTRACTS.mainnet.USDT.erc20 as `0x${string}`,
    watch: true,
  });
  const { price: usdtPrice } = useAvnuPrice("USDT");

  // 5. WBTC
  const { data: wbtcData } = useBalance({
    address,
    token: TONGO_CONTRACTS.mainnet.WBTC.erc20 as `0x${string}`,
    watch: true,
  });
  const { price: wbtcPrice } = useAvnuPrice("WBTC");

  const portfolio = useMemo(() => {
    const assets: AssetPortfolio[] = [];

    const addAsset = (symbol: string, pubData: any, price: number) => {
      const pubStr = pubData?.formatted || "0";
      const privStr = privateBalances?.[symbol] || "0";

      const pubVal = parseFloat(pubStr);
      const privVal = parseFloat(privStr);

      const pubUsd = pubVal * price;
      const privUsd = privVal * price;

      assets.push({
        symbol,
        publicBalance: pubVal,
        privateBalance: privVal,
        price,
        publicUsd: pubUsd,
        privateUsd: privUsd,
        totalUsd: pubUsd + privUsd,
        formattedPublic: pubStr,
        formattedPrivate: privStr,
      });
    };

    addAsset("STRK", strkData, strkPrice);
    addAsset("ETH", ethData, ethPrice);
    addAsset("USDC", usdcData, usdcPrice);
    addAsset("USDT", usdtData, usdtPrice);
    addAsset("WBTC", wbtcData, wbtcPrice);

    const totalPublicUsd = assets.reduce((sum, a) => sum + a.publicUsd, 0);
    const totalPrivateUsd = assets.reduce((sum, a) => sum + a.privateUsd, 0);
    const totalUsd = totalPublicUsd + totalPrivateUsd;
    const privacyRatio = totalUsd > 0 ? (totalPrivateUsd / totalUsd) * 100 : 0;

    return {
      assets,
      totalPublicUsd,
      totalPrivateUsd,
      totalUsd,
      privacyRatio,
      loading: loadingPrivateBalance,
      refetch: () => refetchPrivateBalances(), // Expose refetch
      errors,
    };
  }, [
    strkData,
    strkPrice,
    ethData,
    ethPrice,
    usdcData,
    usdcPrice,
    usdtData,
    usdtPrice,
    wbtcData,
    wbtcPrice,
    privateBalances,
    loadingPrivateBalance,
    refetchPrivateBalances, // Add dependency
  ]);

  return portfolio;
}
