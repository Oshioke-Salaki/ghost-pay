"use client";
import React, { useState, useEffect } from "react";
import { X, ArrowDown, RefreshCw, Loader2, Wallet } from "lucide-react";
import { useAccount, useBalance } from "@starknet-react/core";
import { getQuotes, executeSwap, Quote } from "@avnu/avnu-sdk";
import { parseUnits, formatUnits } from "ethers"; // or use starknet.js equivalent
import { createPortal } from "react-dom";

// Standard Mainnet Addresses
const TOKENS = {
  ETH: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  STRK: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
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

  const { data: ethBalance, isLoading } = useBalance({
    address,
    token: TOKENS.ETH as `0x${string}`,
    refetchInterval: 10000,
    watch: true,
  });

  // 1. Fetch Quotes when input changes
  useEffect(() => {
    const fetchQuote = async () => {
      if (!sellAmount || parseFloat(sellAmount) <= 0 || !address) {
        setQuote(null);
        return;
      }

      setLoading(true);
      try {
        // Amount must be in BigInt (wei)
        // Note: Assuming 18 decimals for ETH.
        // If using starknet.js v6, use cairo.uint256 or similar, but simple string/BigInt works for AVNU
        const amountInWei = BigInt(Math.floor(parseFloat(sellAmount) * 1e18));

        const quotes = await getQuotes({
          sellTokenAddress: TOKENS.ETH,
          buyTokenAddress: TOKENS.STRK,
          sellAmount: amountInWei,
          takerAddress: address,
        });

        // AVNU returns sorted quotes, best first
        setQuote(quotes[0]);
      } catch (err) {
        console.error("Quote fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce slightly
    const timer = setTimeout(fetchQuote, 500);
    return () => clearTimeout(timer);
  }, [sellAmount, address]);

  // 2. Execute Swap
  const handleSwap = async () => {
    if (!account || !quote) return;

    try {
      setSwapping(true);

      await executeSwap({
        provider: account,
        quote,
        slippage: 0.001,
      });

      alert("Swap submitted! Your STRK balance will update shortly.");
      onClose();
      setSellAmount("");
    } catch (err) {
      console.error(err);
      alert("Swap failed. See console.");
    } finally {
      setSwapping(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-2">
            <div className="bg-black text-white p-1.5 rounded-lg">
              <RefreshCw size={16} />
            </div>
            <span className="font-bold text-gray-900">Quick Swap</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Sell Input (ETH) */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="flex justify-between text-xs text-gray-500 mb-2 uppercase font-bold tracking-wider">
              <span>Sell</span>
              <span>
                Balance:{" "}
                {ethBalance ? parseFloat(ethBalance.formatted).toFixed(2) : "-"}{" "}
                ETH
              </span>
            </div>
            <div className="flex justify-between items-center">
              <input
                type="number"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                placeholder="0.0"
                className="bg-transparent text-2xl font-mono outline-none w-full placeholder:text-gray-300"
              />
              <span className="bg-white border border-gray-200 px-2 py-1 rounded-lg font-bold text-sm shadow-sm">
                ETH
              </span>
            </div>
          </div>

          {/* Divider Arrow */}
          <div className="flex justify-center -my-2 relative z-10">
            <div className="bg-white border border-gray-200 p-1.5 rounded-full shadow-sm text-gray-400">
              <ArrowDown size={16} />
            </div>
          </div>

          {/* Buy Output (STRK) */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="flex justify-between text-xs text-gray-500 mb-2 uppercase font-bold tracking-wider">
              <span>Receive (Estimated)</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-mono text-gray-900">
                {loading ? (
                  <Loader2
                    className="animate-spin text-gray-400 mt-1"
                    size={24}
                  />
                ) : quote ? (
                  (Number(quote.buyAmount) / 1e18).toFixed(4)
                ) : (
                  "0.0"
                )}
              </div>
              <span className="bg-black text-white px-2 py-1 rounded-lg font-bold text-sm shadow-sm">
                STRK
              </span>
            </div>
          </div>

          {/* Rate Info */}
          {quote && (
            <div className="flex justify-between items-center text-xs text-gray-500 px-1">
              <span>Rate</span>
              <span>
                1 ETH ≈{" "}
                {(Number(quote.buyAmount) / Number(quote.sellAmount)).toFixed(
                  2
                )}{" "}
                STRK
              </span>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleSwap}
            disabled={!quote || swapping || loading}
            className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg shadow-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {swapping ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Wallet size={18} />
            )}
            {swapping ? "Confirming..." : "Swap to STRK"}
          </button>

          <div className="text-center">
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
