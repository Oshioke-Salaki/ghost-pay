import React from "react";
import { ArrowLeftRight, Lock, Shield, Wallet } from "lucide-react";
import { useBalance, useAccount } from "@starknet-react/core";
import { TONGO_CONTRACTS } from "@/lib/tongoData";
import { useUIStore } from "@/store/uiStore";

// Hardcoded Logo URLs
const TOKEN_LOGOS: Record<string, string> = {
  STRK: "/starknetlogo.svg",
  ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026",
  USDC: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026",
  USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=026",
  WBTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026",
};

type VaultTokenRowProps = {
  symbol: string;
  privateBalance: string;
};

export default function VaultTokenRow({
  symbol,
  privateBalance,
}: VaultTokenRowProps) {
  const { address } = useAccount();
  const hideAmounts = useUIStore((s) => s.hideAmounts);
  const logo = TOKEN_LOGOS[symbol];
  const tokenInfo = TONGO_CONTRACTS["mainnet"][symbol as keyof typeof TONGO_CONTRACTS["mainnet"]];

  // Fetch Public Balance
  const { data: publicData, isLoading: loadingPublic } = useBalance({
    address,
    token: tokenInfo?.erc20 as `0x${string}`,
    refetchInterval: 10000,
  });

  const publicBalStr = publicData ? parseFloat(publicData.formatted).toFixed(4) : "0.0000";
  const privateBalStr = parseFloat(privateBalance || "0").toFixed(4);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 hover:shadow-sm transition-all mb-3">
      {/* Token Info */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 p-1.5 flex items-center justify-center shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo}
            alt={symbol}
            width={28}
            height={28}
            className="rounded-full object-contain"
          />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{symbol}</h3>
          <p className="text-xs text-gray-400">Starknet Mainnet</p>
        </div>
      </div>

      {/* Balances */}
      <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-center flex-1 md:px-8">
        {/* Public */}
        <div className="text-right md:text-center">
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5 flex items-center gap-1 justify-end md:justify-center">
                <Wallet size={10} /> Public
            </p>
            <p className={`font-mono font-medium text-gray-900 ${loadingPublic ? "animate-pulse bg-gray-100 rounded text-transparent" : ""} ${hideAmounts ? "blur-sm" : ""}`}>
                {publicBalStr}
            </p>
        </div>

        {/* Separator / Arrow */}
        <ArrowLeftRight size={16} className="text-gray-300" />

        {/* Private */}
        <div className="text-left md:text-center">
            <p className="text-[10px] uppercase font-bold text-purple-500 mb-0.5 flex items-center gap-1 justify-start md:justify-center">
                <Lock size={10} /> Private
            </p>
            <p className={`font-mono font-medium text-purple-900 ${hideAmounts ? "blur-sm" : ""}`}>
                {privateBalStr}
            </p>
        </div>
      </div>

      {/* </div> */}

      {/* Actions removed as requested - pure balance row now */}
    </div>
  );
}
