"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, ArrowDown, RefreshCw, Loader2, Wallet, ChevronDown } from "lucide-react";
import { useAccount, useBalance } from "@starknet-react/core";
import { getQuotes, executeSwap, Quote } from "@avnu/avnu-sdk";
import { createPortal } from "react-dom";
import { TONGO_CONTRACTS } from "@/lib/tongoData";
import toast from "react-hot-toast";

// Hardcoded Logo URLs (matching ShieldModal)
const TOKEN_LOGOS: Record<string, string> = {
  STRK: "/starknetlogo.svg",
  ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026",
  USDC: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026",
  USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=026",
  WBTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026",
};

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SwapModal({ isOpen, onClose }: SwapModalProps) {
  const { account, address } = useAccount();
  const [sellAmount, setSellAmount] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [timer, setTimer] = useState(0); // Trigger for refresh

  // Token Selection State
  const [sellToken, setSellToken] = useState("ETH");
  const [buyToken, setBuyToken] = useState("STRK");

  const tokens = Object.keys(TONGO_CONTRACTS["mainnet"]);
  
  const sellTokenConfig = TONGO_CONTRACTS["mainnet"][sellToken as keyof typeof TONGO_CONTRACTS["mainnet"]];
  const buyTokenConfig = TONGO_CONTRACTS["mainnet"][buyToken as keyof typeof TONGO_CONTRACTS["mainnet"]];

  // Fetch Balances & Decimals
  const { data: sellBalanceData } = useBalance({
    address,
    token: sellTokenConfig?.erc20 as `0x${string}`,
    refetchInterval: 10000,
    watch: true,
  });

  const { data: buyBalanceData } = useBalance({
    address,
    token: buyTokenConfig?.erc20 as `0x${string}`,
    refetchInterval: 10000,
  });

  const sellBalance = sellBalanceData ? parseFloat(sellBalanceData.formatted) : 0;
  const buyBalance = buyBalanceData ? parseFloat(buyBalanceData.formatted) : 0;
  
  // Use known decimals from useBalance, default to 18 if undefined (fallback)
  // Note: USDC/USDT are 6 decimals.
  const sellDecimals = sellBalanceData?.decimals || (['USDC', 'USDT'].includes(sellToken) ? 6 : 18);
  const buyDecimals = buyBalanceData?.decimals || (['USDC', 'USDT'].includes(buyToken) ? 6 : 18);

  // Auto-Refresh Interval (1 min)
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
        setTimer(p => p + 1); // Triggers quote fetch
    }, 60000); // 1 minute
    return () => clearInterval(interval);
  }, [isOpen]);

  // Fetch Quotes
  useEffect(() => {
    const fetchQuote = async () => {
      if (!sellAmount || parseFloat(sellAmount) <= 0 || !address || !sellTokenConfig || !buyTokenConfig) {
        setQuote(null);
        return;
      }

      setLoading(true);
      try {
        const amountInWei = BigInt(Math.floor(parseFloat(sellAmount) * (10 ** sellDecimals)));

        const quotes = await getQuotes({
          sellTokenAddress: sellTokenConfig.erc20,
          buyTokenAddress: buyTokenConfig.erc20,
          sellAmount: amountInWei,
          takerAddress: address,
        });

        setQuote(quotes[0]);
      } catch (err) {
        console.error("Quote fetch failed", err);
        setQuote(null);
      } finally {
        setLoading(false);
      }
    };

    // Debounce for typing
    const debounce = setTimeout(fetchQuote, 600);
    return () => clearTimeout(debounce);
  }, [sellAmount, address, sellToken, buyToken, sellTokenConfig, buyTokenConfig, sellDecimals, timer]); 
  // Added 'timer' ref dependency to trigger re-run

  // Execute Swap
  const handleSwap = async () => {
    if (!account || !quote) return;

    try {
      setSwapping(true);
      const toastId = toast.loading("Swapping...");

      await executeSwap({
        provider: account,
        quote,
        slippage: 0.05, 
      });

      toast.success("Swap submitted!", { id: toastId });
      onClose();
      setSellAmount("");
    } catch (err) {
      console.error(err);
      toast.error("Swap failed");
    } finally {
      setSwapping(false);
    }
  };

  const switchTokens = () => {
    setSellToken(buyToken);
    setBuyToken(sellToken);
    setSellAmount("");
    setQuote(null);
  };

  const setPercentage = (percent: number) => {
    if (!sellBalance) return;
    setSellAmount((sellBalance * percent).toString());
  };

  // Helper for Rate Calculation
  // Rate = (BuyAmount / 10^BuyDecimals) / (SellAmount / 10^SellDecimals)
  const getRate = () => {
      if (!quote) return "0";
      const buyAmt = Number(quote.buyAmount) / (10 ** buyDecimals);
      const sellAmt = Number(quote.sellAmount) / (10 ** sellDecimals);
      if (sellAmt === 0) return "0";
      return (buyAmt / sellAmt).toFixed(4);
  };

  if (!isOpen) return null;

  return createPortal(
    <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-2">
           <div className="flex items-center gap-2">
                <div className="bg-black text-white p-2 rounded-lg">
                  <RefreshCw size={20} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Avnu Swap</h2>
           </div>
           <button 
               onClick={onClose}
               className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-black transition-colors"
           >
             <X size={24} />
           </button>
        </div>

        <div className="p-4 pt-2">
          
          {/* SELL CARD (Input) */}
          <div className="bg-gray-50 p-6 pb-8 rounded-3xl border border-gray-100 hover:border-gray-200 transition-colors z-0 relative">
             {/* Header Row */}
             <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Sell</span>
                <div className="flex items-center gap-2">
                     <button onClick={() => setPercentage(0.25)} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg text-xs font-bold text-gray-600 transition-colors">25%</button>
                     <button onClick={() => setPercentage(0.50)} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg text-xs font-bold text-gray-600 transition-colors">50%</button>
                     <button onClick={() => setPercentage(1.0)} className="px-3 py-1 bg-black hover:bg-gray-800 rounded-lg text-xs font-bold text-white transition-colors">Max</button>
                </div>
             </div>

             {/* Input Row */}
             <div className="flex items-start justify-between gap-4">
                <input
                    type="number"
                    value={sellAmount}
                    onChange={(e) => setSellAmount(e.target.value)}
                    placeholder="0"
                    className="bg-transparent text-4xl font-mono font-bold text-gray-900 placeholder:text-gray-300 outline-none flex-1 w-full min-w-0"
                  />

                <div className="flex flex-col items-end gap-2 shrink-0">
                    {/* Token Selector */}
                    <div className="relative group">
                        <div className="flex items-center gap-2 bg-white border border-gray-200 py-2 pl-2 pr-8 rounded-full shadow-sm hover:bg-gray-50 transition-colors cursor-pointer pointer-events-none">
                            <div className="w-6 h-6 rounded-full bg-gray-100 p-0.5 flex items-center justify-center overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={TOKEN_LOGOS[sellToken] || "/starknetlogo.svg"} alt={sellToken} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-bold text-base text-gray-900">{sellToken}</span>
                        </div>
                        <select 
                            value={sellToken} 
                            onChange={(e) => setSellToken(e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        >
                             {tokens.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                    </div>
                    
                    <span className="text-xs text-gray-500 font-mono">
                        Bal: {sellBalance.toFixed(4)}
                    </span>
                </div>
             </div>
          </div>

          {/* GAP w/ ARROW */}
          <div className="relative h-4 z-10">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <button 
                        onClick={switchTokens}
                        className="bg-white border-4 border-white rounded-xl p-2 shadow-lg text-gray-500 hover:text-black hover:scale-110 transition-all hover:bg-gray-50 bg-white"
                    >
                        <ArrowDown size={24} strokeWidth={3} />
                    </button>
                </div>
          </div>

          {/* BUY CARD (Output) */}
          <div className="bg-gray-50 p-6 pt-8 rounded-3xl border border-gray-100 relative z-0">
             <div className="flex justify-between mb-4">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Receive (Estimated)</span>
             </div>

             <div className="flex items-center justify-between gap-4">
                <div className="text-4xl font-mono font-bold text-gray-900">
                    {loading ? (
                       <Loader2 className="animate-spin text-gray-300" size={24} /> 
                    ) : quote ? (
                        (Number(quote.buyAmount) / (10 ** buyDecimals)).toFixed(4)
                    ) : "0.0"}
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                    {/* Token Selector (Buy) */}
                    <div className="relative group">
                        <div className="flex items-center gap-2 bg-white border border-gray-200 py-2 pl-2 pr-8 rounded-full shadow-sm hover:bg-gray-50 transition-colors cursor-pointer pointer-events-none">
                            <div className="w-6 h-6 rounded-full bg-gray-100 p-0.5 flex items-center justify-center overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={TOKEN_LOGOS[buyToken] || "/starknetlogo.svg"} alt={buyToken} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-bold text-base text-gray-900">{buyToken}</span>
                        </div>
                        <select 
                            value={buyToken} 
                            onChange={(e) => setBuyToken(e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        >
                             {tokens.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                    </div>

                    <span className="text-xs text-gray-500 font-mono">
                        Bal: {buyBalance.toFixed(4)}
                    </span>
                </div>
             </div>
          </div>

          {/* Rate Info */}
          {quote && (
            <div className="px-2 pt-2 flex justify-between items-center text-xs text-gray-500">
              <span>Rate</span>
              <span>1 {sellToken} ≈ {getRate()} {buyToken}</span>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleSwap}
            disabled={!quote || swapping || loading || parseFloat(sellAmount || "0") > sellBalance}
            className="w-full py-5 bg-black text-white rounded-2xl font-bold text-xl shadow-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 mt-6"
          >
            {swapping ? (
              <Loader2 className="animate-spin" />
            ) : (
                <Wallet size={20} />
            )}
            {swapping ? "Processing..." : parseFloat(sellAmount || "0") > sellBalance ? "Insufficient Balance" : `Swap to ${buyToken}`}
          </button>
          
           <div className="text-center mt-4">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">
              Powered by AVNU
            </span>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}
