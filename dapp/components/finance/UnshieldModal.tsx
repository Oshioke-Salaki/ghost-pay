"use client";
import React, { useState } from "react";
import { X, Lock, ArrowUpRight, Wallet } from "lucide-react";
import { parseUnits } from "ethers";
import toast from "react-hot-toast";
import MagicInput from "@/components/MagicInput";

type UnshieldModalProps = {
  isOpen: boolean;
  onClose: () => void;
  privateBalance: string | number; // Display string or number
  tongoAccount: any;
  defaultRecipient?: string;
};

export default function UnshieldModal({
  isOpen,
  onClose,
  privateBalance,
  tongoAccount,
  defaultRecipient,
}: UnshieldModalProps) {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState(defaultRecipient || "");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleUnshield = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!recipient) {
      toast.error("Please enter a recipient address");
      return;
    }

    // Basic client side balance check (using number comparison for simplicity, though BigInt is safer)
    if (Number(amount) > Number(privateBalance)) {
        toast.error("Insufficient shielded balance");
        return;
    }

    setLoading(true);
    try {
      const amountWei = parseUnits(amount, 18);
      // SDK might expect withdraw(amount, recipient)
      const tx = await tongoAccount.withdraw(amountWei, recipient);
      console.log("Withdraw tx:", tx);
      toast.success("Unshielding initiated! Funds usually arrive in 2-5 mins.");
      onClose();
      setAmount("");
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to unshield: " + (e.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ArrowUpRight size={24} className="text-black" />
            Unshield Funds
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-black text-white p-4 rounded-2xl border border-gray-800">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
              You Unshield (Private tSTRK)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent text-3xl font-mono font-bold outline-none placeholder:text-gray-600"
              />
              <button 
                 onClick={() => setAmount(privateBalance.toString())}
                 className="text-xs font-bold text-gray-300 hover:text-white bg-gray-800 px-2 py-1 rounded"
              >
                MAX
              </button>
            </div>
            <div className="text-right text-xs text-gray-500 mt-1">
              Available: {Number(privateBalance).toFixed(4)} tSTRK
            </div>
          </div>

          <div className="space-y-2">
               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                  To Public Wallet
               </label>
               <div className="relative">
                   <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                       <Wallet size={16} />
                   </div>
                   <input 
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="0x..."
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                   />
                   {recipient === defaultRecipient && defaultRecipient && (
                       <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                           My Wallet
                       </div>
                   )}
               </div>
          </div>


          <button
            onClick={handleUnshield}
            disabled={loading}
            className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>Processing...</>
            ) : (
              <>Confirm Unshielding</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
