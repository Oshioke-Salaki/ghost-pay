"use client";
import { useState, useEffect } from "react";
import { useAccount, useProvider, useBalance } from "@starknet-react/core";
import { useTongoAccount } from "@/hooks/useTongoAccount";
import { STRK_ADDR, ETH_ADDR } from "@/lib/data";
import { parseUnits, formatUnits } from "ethers";
import {
  ArrowRightLeft,
  Wallet,
  Ghost,
  Lock,
  Loader2,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import SwapModal from "@/components/SwapModal";
import WalletConnectButton from "@/components/ConnectWalletButton";
import Link from "next/link";
import { motion } from "framer-motion";
import { TONGO_CONTRACTS } from "@/lib/tongoData";
import { cairo, CallData } from "starknet";

export default function TreasuryPage() {
  const { address, account } = useAccount();
  const { provider } = useProvider();

  // Tongo State
  const { tongoAccount, initializeTongo, isInitializing, conversionRate } =
    useTongoAccount();
  const [privateBalance, setPrivateBalance] = useState("0.0");

  // Vault Logic State
  const [vaultMode, setVaultMode] = useState<"wrap" | "unwrap">("wrap");
  const [actionAmount, setActionAmount] = useState("");
  const [isTransacting, setIsTransacting] = useState(false);

  // Modals
  const [showSwap, setShowSwap] = useState(false);

  // Public Balances
  const { data: strkData } = useBalance({
    address,
    token: STRK_ADDR,
    watch: true,
  });
  const { data: ethData } = useBalance({
    address,
    token: ETH_ADDR,
    watch: true,
  });

  // Fetch Private Balance
  useEffect(() => {
    const fetchPriv = async () => {
      if (!tongoAccount || !conversionRate) return;
      try {
        const state = await tongoAccount.state();
        const bal = state.balance * conversionRate;
        setPrivateBalance(formatUnits(bal.toString(), 18));
      } catch (e) {
        console.error(e);
      }
    };
    if (tongoAccount) {
      fetchPriv();
      const i = setInterval(fetchPriv, 10000);
      return () => clearInterval(i);
    }
  }, [tongoAccount, conversionRate]);

  // Handle Vault Transactions (Wrap/Unwrap)
  const handleVaultTransaction = async () => {
    if (!account || !tongoAccount || !actionAmount) return;
    setIsTransacting(true);

    try {
      const wei = parseUnits(actionAmount, 18);
      const tongoUnits = wei / (conversionRate || 1n);

      if (vaultMode === "wrap") {
        // --- WRAP (Public -> Private) ---
        const op = await tongoAccount.fund({
          sender: address!,
          amount: tongoUnits,
        });
        const fundCall = op.toCalldata();

        const tongoContractAddress = TONGO_CONTRACTS["mainnet"]["STRK"].address;

        const approveCall = {
          contractAddress: STRK_ADDR,
          entrypoint: "approve",
          calldata: CallData.compile({
            spender: tongoContractAddress,
            amount: cairo.uint256(wei),
          }),
        };
        const tx = await account.execute([approveCall, fundCall]);
        await provider.waitForTransaction(tx.transaction_hash);
        alert("Wrapped successfully. Assets moved to Ghost Vault.");
      } else {
        // --- UNWRAP (Private -> Public) ---
        const op = await tongoAccount.withdraw({
          sender: address!,
          amount: tongoUnits,
          to: address!,
        });
        const call = op.toCalldata();

        const tx = await account.execute([call]);
        await provider.waitForTransaction(tx.transaction_hash);
        alert("Unwrapped successfully. Assets moved to Public Wallet.");
      }

      setActionAmount("");
    } catch (e) {
      console.error(e);
      alert(`Failed to ${vaultMode}`);
    } finally {
      setIsTransacting(false);
    }
  };

  if (!address)
    return (
      <div className="p-20 text-center">
        <WalletConnectButton />
      </div>
    );

  return (
    <div className="py-12 px-6 md:px-[80px] max-w-7xl mx-auto">
      <SwapModal isOpen={showSwap} onClose={() => setShowSwap(false)} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Treasury Management
        </h1>
        <p className="text-gray-500">
          Manage public liquidity and private payroll reserves.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-stretch h-full">
        {/* --- LEFT: PUBLIC WALLET (Light Theme) --- */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm flex flex-col relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 rounded-xl text-gray-600">
                <Wallet size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Public Wallet
                </h2>
                <p className="text-xs text-gray-500 font-mono">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </p>
              </div>
            </div>
            <div className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-500 uppercase tracking-wide">
              Visible
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {/* ETH Balance */}
            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:border-gray-300 transition-all">
              <div className="flex items-center gap-3">
                {/* Icon Placeholder */}
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                  <img
                    src="https://imagedelivery.net/0xPAQaDtnQhBs8IzYRIlNg/e07829b7-0382-4e03-7ecd-a478c5aa9f00/logo"
                    alt=""
                  />
                </div>
                <span className="font-bold text-gray-700">ETH</span>
              </div>
              <span className="font-mono font-medium">
                {parseFloat(ethData?.formatted || "0").toFixed(4)}
              </span>
            </div>

            {/* STRK Balance */}
            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:border-gray-300 transition-all bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                  <img src="/starknetlogo.svg" alt="" />
                </div>
                <span className="font-bold text-gray-900">STRK</span>
              </div>
              <span className="font-mono font-bold text-xl">
                {parseFloat(strkData?.formatted || "0").toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-auto">
            <button
              onClick={() => setShowSwap(true)}
              className="w-full py-4 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} /> Swap Assets (AVNU)
            </button>
          </div>
        </motion.div>

        {/* --- RIGHT: PRIVATE VAULT (Dark Theme / Velvet) --- */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#0A0A0A] border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col"
        >
          {/* Background Gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-900/20 blur-[80px] rounded-full pointer-events-none"></div>

          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 rounded-xl text-purple-300 border border-white/10">
                <Ghost size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Ghost Vault</h2>
                <p className="text-xs text-gray-400">Powered by Tongo</p>
              </div>
            </div>
            {tongoAccount && (
              <div className="px-3 py-1 bg-green-900/30 border border-green-500/30 rounded-full text-xs font-bold text-green-400 uppercase tracking-wide flex items-center gap-1">
                <ShieldCheck size={12} /> Active
              </div>
            )}
          </div>

          {!tongoAccount ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-gray-500">
                <Lock size={32} />
              </div>
              <p className="text-gray-400 text-sm max-w-xs">
                Initialize your identity to view encrypted balances and manage
                private funds.
              </p>
              <button
                onClick={() => initializeTongo()}
                disabled={isInitializing}
                className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-all"
              >
                {isInitializing ? "Deriving..." : "Unlock Vault"}
              </button>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col h-full">
              {/* Private Balance */}
              <div className="mb-6 text-center p-6 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">
                  Private Balance
                </p>
                <p className="text-4xl font-mono font-bold text-white tracking-tighter">
                  {parseFloat(privateBalance).toFixed(2)}{" "}
                  <span className="text-lg text-purple-400">tSTRK</span>
                </p>
              </div>

              <div className="mt-auto space-y-4">
                {/* Mode Toggle */}
                <div className="bg-white/5 p-1 rounded-xl flex">
                  <button
                    onClick={() => setVaultMode("wrap")}
                    disabled={isTransacting}
                    className={`flex-1 py-2 text-xs !disabled:cursor-not-allowed font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-2 ${
                      vaultMode === "wrap"
                        ? "bg-white text-black"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <ArrowUpRight size={14} /> Wrap
                  </button>
                  <button
                    onClick={() => setVaultMode("unwrap")}
                    disabled={isTransacting}
                    className={`flex-1 py-2 text-xs disabled:cursor-not-allowed font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-2 ${
                      vaultMode === "unwrap"
                        ? "bg-purple-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <ArrowDownLeft size={14} /> Unwrap
                  </button>
                </div>

                {/* Action Input */}
                <div className="relative">
                  <input
                    type="number"
                    placeholder={
                      vaultMode === "wrap"
                        ? "Amount to Wrap"
                        : "Amount to Unwrap"
                    }
                    value={actionAmount}
                    onChange={(e) => setActionAmount(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-colors font-mono"
                  />
                  <button
                    onClick={handleVaultTransaction}
                    disabled={isTransacting || !actionAmount}
                    className={`absolute right-2 top-2 bottom-2  px-4 rounded-lg font-bold text-xs transition-colors flex items-center gap-1 disabled:opacity-50
                                    ${
                                      vaultMode === "wrap"
                                        ? "bg-white text-black hover:bg-gray-200"
                                        : "bg-purple-600 hover:bg-purple-500 text-white"
                                    }
                                `}
                  >
                    {isTransacting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : vaultMode === "wrap" ? (
                      <Lock size={14} />
                    ) : (
                      <ArrowRightLeft size={14} />
                    )}
                    {vaultMode === "wrap" ? "Shield" : "Withdraw"}
                  </button>
                </div>

                <p className="text-[10px] text-gray-500 text-center">
                  {vaultMode === "wrap"
                    ? "Moves STRK from Public Wallet to Ghost Vault."
                    : "Moves tSTRK from Ghost Vault back to Public Wallet."}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
