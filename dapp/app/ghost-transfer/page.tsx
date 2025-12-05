"use client";
import { useState } from "react";
import Link from "next/link";
import { TyphoonSDK } from "typhoon-sdk";
import { useAccount, useBalance } from "@starknet-react/core";
import { parseAmountToWei } from "@/lib/utils";
import {
  Loader2,
  Ghost,
  Sparkles,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  Info,
  Lock,
} from "lucide-react";
import { STRK_ADDR } from "@/lib/data";
import WalletConnectButton from "@/components/ConnectWalletButton";

export default function GhostTransfer() {
  const sdk = new TyphoonSDK();
  const { address, account } = useAccount();

  const { data: userBalance } = useBalance({
    address,
    token: STRK_ADDR,
    refetchInterval: 10000,
    watch: true,
  });

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const balance = parseFloat(userBalance?.formatted ?? "0").toFixed(2);

  const handlePercentageClick = (percent: number) => {
    const value = (Number(balance) * percent).toFixed(2);
    setAmount(value.toString());
  };

  const handleTransfer = async () => {
    if (!account) return;
    if (!recipient || !amount) return alert("Enter all fields");
    if (Number(amount) < 10) return alert("Minimum amount is 10 STRK");
    if (Number(amount) > Number(balance)) return alert("Insufficient balance");

    try {
      setLoading(true);
      setSuccess(false);

      const weiAmount = parseAmountToWei(Number(amount));

      const calls = await sdk.generate_approve_and_deposit_calls(
        weiAmount,
        STRK_ADDR
      );

      const multiCall = await account.execute(calls);
      await account.waitForTransaction(multiCall.transaction_hash);

      await sdk.download_notes(multiCall.transaction_hash);

      await sdk.withdraw(multiCall.transaction_hash, [recipient]);

      setTxHash(multiCall.transaction_hash);
      setSuccess(true);
      setRecipient("");
      setAmount("");
    } catch (err) {
      console.error(err);
      alert("The ritual failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black flex flex-col items-center justify-center p-4 overflow-hidden shadow-[inset_0_10px_20px_rgba(0,0,0,0.5)]">
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
        >
          <div className="p-2 bg-white/5 rounded-full group-hover:bg-white/10 border border-white/5">
            <ArrowLeft size={18} />
          </div>
          <span className="text-sm font-medium tracking-wide">
            Exit Ghost Mode
          </span>
        </Link>
      </div>

      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#1a103c_0%,_#000000_100%)] z-0" />
      <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-purple-900/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-indigo-900/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 pointer-events-none mix-blend-overlay"></div>

      {/* --- MAIN CARD --- */}
      <div className="relative z-10 w-full max-w-lg">
        {/* Card Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-25 animate-pulse"></div>

        <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-full mb-4 ring-1 ring-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              {loading ? (
                <Ghost className="w-8 h-8 text-purple-400 animate-bounce" />
              ) : (
                <EyeOff className="w-8 h-8 text-purple-400" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-white tracking-wider font-sans">
              GHOST TRANSFER
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Anonymous Protocol on Starknet
            </p>
          </div>

          {!account ? (
            /* --- EMPTY STATE (Connect Wallet) --- */
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                <Lock size={24} className="text-gray-400" />
              </div>
              <h3 className="text-white font-medium text-lg mb-2">
                Access Restricted
              </h3>
              <p className="text-gray-500 text-sm mb-8 max-w-xs">
                You must connect a Starknet wallet to initiate the anonymization
                protocol.
              </p>

              {/* Use the WalletConnectButton but style specifically for this dark page is handled by its internal logic or wrapper */}
              <div className="scale-110">
                <WalletConnectButton />
              </div>
            </div>
          ) : (
            /* --- ACTIVE FORM STATE --- */
            <>
              {/* Balance */}
              <div className="flex justify-between items-center mb-6 px-4 py-3 bg-white/5 rounded-lg border border-white/5">
                <span className="text-gray-400 text-xs uppercase tracking-widest flex items-center gap-2">
                  <Sparkles size={12} className="text-purple-400" /> Available
                  Spirit
                </span>
                <span className="font-mono text-white text-lg">
                  {balance} STRK
                </span>
              </div>

              {/* Form Inputs */}
              <div className="space-y-6">
                {/* Recipient */}
                <div>
                  <label className="block text-gray-500 text-xs uppercase tracking-widest mb-2 ml-1">
                    Target Vessel (Address)
                  </label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="0x..."
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-700 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono text-sm"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-gray-500 text-xs uppercase tracking-widest mb-2 ml-1">
                    Amount to Vanish
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={10}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Min 10 STRK"
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-700 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono text-sm"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      {[0.25, 0.5, 1].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handlePercentageClick(p)}
                          className="px-2 py-1 text-[10px] text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors uppercase"
                        >
                          {p === 1 ? "Max" : `${p * 100}%`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleTransfer}
                  disabled={
                    loading || Number(amount) < 10 || !amount || !recipient
                  }
                  className={`
                    w-full py-4 rounded-lg font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2
                    ${
                      loading || Number(amount) < 10 || !amount || !recipient
                        ? "bg-white/5 text-gray-600 cursor-not-allowed border border-white/5"
                        : "bg-white text-black hover:bg-purple-50 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    }
                  `}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Ghost size={18} />
                  )}
                  {loading ? "Dematerializing..." : "Initiate Shadow Send"}
                </button>
              </div>

              {/* INFO SECTION */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="flex items-center gap-2 text-xs text-purple-400 hover:text-purple-300 transition-colors mx-auto"
                >
                  <Info size={14} />
                  <span>How is this private?</span>
                </button>

                {showInfo && (
                  <div className="mt-4 p-4 bg-purple-900/10 border border-purple-500/20 rounded-lg animate-in fade-in slide-in-from-top-2">
                    <div className="flex gap-3">
                      <Lock
                        className="text-purple-400 shrink-0 mt-0.5"
                        size={16}
                      />
                      <div className="space-y-2">
                        <p className="text-xs text-gray-300 leading-relaxed">
                          <strong className="text-purple-200">
                            Zero-Knowledge Architecture:
                          </strong>{" "}
                          This transfer uses Typhoon Protocol to break the
                          on-chain link between your wallet and the recipient.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Success State */}
              {success && txHash && (
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="text-green-400 shrink-0 mt-1" />
                    <div>
                      <h3 className="text-green-400 font-bold text-sm">
                        Transfer Complete
                      </h3>
                      <a
                        href={`https://starkscan.co/tx/${txHash}`}
                        target="_blank"
                        className="inline-block mt-1 text-xs text-green-400/70 underline hover:text-green-300 font-mono"
                      >
                        {txHash.slice(0, 20)}...
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
