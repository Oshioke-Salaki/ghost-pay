"use client";
import { usePrivateBalance } from "@/hooks/usePrivateBalance";
import { useTongoAccount } from "@/hooks/useTongoAccount";
import { STRK_ADDR } from "@/lib/data";
import { TONGO_CONTRACTS } from "@/lib/tongoData";
import { useAccount, useProvider } from "@starknet-react/core";
import { parseUnits } from "ethers";
import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowRightLeft,
  ArrowUpRight,
  Ghost,
  Loader2,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { cairo, CallData } from "starknet";

function PrivateVault() {
  const { account, address } = useAccount();
  const { provider } = useProvider();
  const { tongoAccount, initializeTongo, isInitializing, conversionRate } =
    useTongoAccount();
  const [vaultMode, setVaultMode] = useState<"wrap" | "unwrap">("wrap");
  const [actionAmount, setActionAmount] = useState("");
  const [isTransacting, setIsTransacting] = useState(false);

  const { privateBalance } = usePrivateBalance({
    tongoAccount,
    conversionRate,
  });
  const handleVaultTransaction = async () => {
    if (!account || !tongoAccount || !actionAmount) return;
    setIsTransacting(true);

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

            <div className="relative">
              <input
                type="number"
                placeholder={
                  vaultMode === "wrap" ? "Amount to Wrap" : "Amount to Unwrap"
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
  );
}

export default PrivateVault;
