"use client";
import { usePrivateBalance } from "@/hooks/usePrivateBalance";
import { useTongoAccount } from "@/hooks/useTongoAccount";
import { STRK_ADDR } from "@/lib/data";
import { TONGO_CONTRACTS } from "@/lib/tongoData";
import { useAccount, useBalance, useProvider } from "@starknet-react/core";
import { formatUnits, parseUnits } from "ethers";
import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowRightLeft,
  ArrowUpRight,
  Ghost,
  Loader2,
  Lock,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { cairo, CallData } from "starknet";

function PrivateVault() {
  const { account, address } = useAccount();
  const { provider } = useProvider();
  const { tongoAccount, initializeTongo, isInitializing, conversionRate } =
    useTongoAccount();
  const [vaultMode, setVaultMode] = useState<"wrap" | "unwrap">("wrap");
  const [actionAmount, setActionAmount] = useState("");
  const [isTransacting, setIsTransacting] = useState(false);

  // Private Balance
  const { privateBalance } = usePrivateBalance({
    tongoAccount,
    conversionRate,
  });

  // Public Balance (for "Max" functionality on Wrap)
  const { data: publicBalance } = useBalance({
    address,
    token: STRK_ADDR,
    watch: true,
  });

  const setMaxAmount = () => {
    if (vaultMode === "wrap") {
      if (publicBalance) {
        // Leave a tiny dust for gas if needed, but for now exact
        setActionAmount(parseFloat(publicBalance.formatted).toFixed(4));
      }
    } else {
      // Unwrap Max
      setActionAmount(parseFloat(privateBalance).toFixed(4));
    }
  };

  const handleVaultTransaction = async () => {
    if (!account || !tongoAccount || !actionAmount) return;
    setIsTransacting(true);
    const toastId = toast.loading(
      vaultMode === "wrap" ? "Shielding assets..." : "Withdrawing assets..."
    );

    try {
      const wei = parseUnits(actionAmount, 18);
      const tongoUnits = wei / (conversionRate || 1n);

      if (vaultMode === "wrap") {
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
        toast.success("Assets shielded successfully!", { id: toastId });
        setActionAmount("");
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
        toast.success("Assets withdrawn successfully!", { id: toastId });
        setActionAmount("");
      }
    } catch (e) {
      console.error(e);
      toast.error(`Failed to ${vaultMode}. Please try again.`, { id: toastId });
    } finally {
      setIsTransacting(false);
    }
  };

  const currentBalanceDisplay =
    vaultMode === "wrap"
      ? `${parseFloat(publicBalance?.formatted || "0").toFixed(4)} STRK`
      : `${parseFloat(privateBalance).toFixed(4)} tSTRK`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[#0A0A0A] border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col"
    >
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
            {/* Custom Tabs */}
            <div className="bg-white/5 p-1 rounded-xl flex relative">
              <motion.div
                className="absolute top-1 bottom-1 bg-white rounded-lg shadow-sm z-0"
                initial={false}
                animate={{
                  left: vaultMode === "wrap" ? "4px" : "50%",
                  width: "calc(50% - 4px)",
                  x: vaultMode === "wrap" ? 0 : 0, // Adjust if needed
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <button
                onClick={() => setVaultMode("wrap")}
                disabled={isTransacting}
                className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg relative z-10 transition-colors flex items-center justify-center gap-2 ${
                  vaultMode === "wrap" ? "text-black" : "text-gray-400"
                }`}
              >
                <ArrowUpRight size={14} /> Shield (In)
              </button>
              <button
                onClick={() => setVaultMode("unwrap")}
                disabled={isTransacting}
                className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg relative z-10 transition-colors flex items-center justify-center gap-2 ${
                  vaultMode === "unwrap" ? "text-black" : "text-gray-400"
                }`}
              >
                <ArrowDownLeft size={14} /> Withdraw (Out)
              </button>
            </div>

            {/* Input Area */}
            <div className="relative group">
              <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                  Amount
                </span>
                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                  Available:{" "}
                  <span className="text-white font-mono">
                    {currentBalanceDisplay}
                  </span>
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.00"
                  value={actionAmount}
                  onChange={(e) => setActionAmount(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-16 py-4 text-white text-lg placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-colors font-mono"
                />
                <button
                  onClick={setMaxAmount}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-xs text-white px-2 py-1 rounded-md transition-colors"
                >
                  MAX
                </button>
              </div>
            </div>

            <button
              onClick={handleVaultTransaction}
              disabled={isTransacting || !actionAmount}
              className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none
                ${
                  vaultMode === "wrap"
                    ? "bg-white text-black"
                    : "bg-purple-600 text-white"
                }
            `}
            >
              {isTransacting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : vaultMode === "wrap" ? (
                <Lock size={16} />
              ) : (
                <ArrowRightLeft size={16} />
              )}
              {isTransacting
                ? "Processing..."
                : vaultMode === "wrap"
                ? "Encrypt & Shield Assets"
                : "Decrypt & Withdraw Assets"}
            </button>

            <p className="text-[10px] text-gray-500 text-center">
              {vaultMode === "wrap"
                ? "Assets will be encrypted and moved to the Ghost Vault."
                : "Assets will be decrypted and moved to your Public Wallet."}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default PrivateVault;
