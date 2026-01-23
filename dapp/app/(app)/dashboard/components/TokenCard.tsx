import React, { useEffect } from "react";
import { Lock } from "lucide-react";
import { useBalance, useAccount } from "@starknet-react/core";
import { TONGO_CONTRACTS } from "@/lib/tongoData";
import { useUIStore } from "@/store/uiStore";

// Hardcoded Logo URLs for display
const TOKEN_LOGOS: Record<string, string> = {
  STRK: "/starknetlogo.svg",
  ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026",
  USDC: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026",
  USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=026",
  WBTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026",
};

type TokenCardProps = {
  symbol: string;
  viewMode: "public" | "private";
  privateBalance: string | undefined;
  loadingPrivate: boolean;
  isVaultLocked: boolean;
};

export default function TokenCard({
  symbol,
  viewMode,
  privateBalance,
  loadingPrivate,
  isVaultLocked,
}: TokenCardProps) {
  const { address } = useAccount();
  const hideAmounts = useUIStore((s) => s.hideAmounts);
  const logo = TOKEN_LOGOS[symbol];

  // Always get token info
  const tokenInfo = TONGO_CONTRACTS["mainnet"][symbol as keyof typeof TONGO_CONTRACTS["mainnet"]];

  // Always pass token address to avoid default ETH fetch
  const { data: publicData, isLoading: loadingPublic } = useBalance({
    address,
    token: tokenInfo?.erc20 as `0x${string}`,
    watch: viewMode === "public", 
    refetchInterval: viewMode === "public" ? 10000 : false,
    enabled: viewMode === "public",
  });

  useEffect(()=>{
    console.log(publicData, symbol, "publicData")
  }, [publicData, symbol])

  const publicBalance = publicData ? parseFloat(publicData.formatted).toFixed(2) : "0.00";
  const formattedPrivate = privateBalance ? parseFloat(privateBalance).toFixed(2) : "0.00";

  const displayBalance = viewMode === "public" ? publicBalance : formattedPrivate;
  const isLoading = viewMode === "public" ? loadingPublic : loadingPrivate;
  
  const showLocked = viewMode === "private" && isVaultLocked;

  return (
    <div
      className={`group relative bg-white border rounded-2xl p-5 hover:shadow-md transition-all duration-300 ${
        !showLocked && parseFloat(displayBalance) > 0
          ? "border-gray-200"
          : "border-gray-100 opacity-80 hover:opacity-100"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 p-1.5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo}
            alt={symbol}
            width={28}
            height={28}
            className="rounded-full object-contain"
          />
        </div>
        
        {/* Status Badge */}
        {viewMode === "private" ? (
           showLocked ? (
             <Lock size={14} className="text-gray-300" />
           ) : (
             <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-100 uppercase tracking-wide">
               Shielded
             </div>
           )
        ) : (
           <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 border border-gray-100 uppercase tracking-wide">
             Public
           </div>
        )}
      </div>

      <div>
        <p className="text-xs font-bold text-gray-400 mb-0.5">
            {viewMode === "private" ? `t${symbol}` : symbol}
        </p>
        
        <div className="flex items-baseline gap-1">
          {showLocked ? (
             <span className="text-2xl font-bold text-gray-200">Locked</span>
          ) : isLoading && !displayBalance ? ( 
             <div className="h-8 w-24 bg-gray-100 animate-pulse rounded" />
          ) : (
            <span 
                className={`text-2xl font-bold tracking-tight transition-all duration-300 ${
                    hideAmounts ? "blur-md select-none" : ""
                } ${
                    parseFloat(displayBalance) > 0 ? "text-gray-900" : "text-gray-300"
                }`}
            >
              {displayBalance}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
