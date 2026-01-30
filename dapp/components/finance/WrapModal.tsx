"use client";
import React, { useState } from "react";
import { X, Lock, ArrowDown, ChevronDown, Loader2 } from "lucide-react";
import { parseUnits } from "ethers";
import toast from "react-hot-toast";
import { useAccount, useBalance, useProvider } from "@starknet-react/core";
import { cairo, CallData } from "starknet";
import { TONGO_CONTRACTS } from "@/lib/tongoData";

type WrapModalProps = {
  isOpen: boolean;
  onClose: () => void;
  tongoAccounts: Record<string, any>; // Accounts map passed from parent
};

export default function WrapModal({
  isOpen,
  onClose,
  tongoAccounts,
}: WrapModalProps) {
  const { address, account } = useAccount();
  const { provider } = useProvider();

  const [selectedSymbol, setSelectedSymbol] = useState("STRK");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const tokens = Object.keys(TONGO_CONTRACTS["mainnet"]);

  // Safe access to contract data
  const currentToken =
    TONGO_CONTRACTS["mainnet"][
      selectedSymbol as keyof (typeof TONGO_CONTRACTS)["mainnet"]
    ];

  const { data: balanceData, isLoading: loadingBalance } = useBalance({
    address,
    token: currentToken?.erc20 as `0x${string}`,
    refetchInterval: 5000,
  });

  const publicBalance = balanceData ? parseFloat(balanceData.formatted) : 0.0;

  if (!isOpen) return null;

  const handleWrap = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (Number(amount) > publicBalance) {
      toast.error("Insufficient balance");
      return;
    }

    // Ensure we have the Tongo SDK instance for this token
    const accountInstance = tongoAccounts?.[selectedSymbol];
    if (!accountInstance) {
      toast.error(`Vault not initialized for ${selectedSymbol}`);
      return;
    }

    if (!account || !currentToken) {
      toast.error("Account or Token config missing");
      return;
    }

    setLoading(true);
    const toastId = toast.loading(`Shielding ${selectedSymbol}...`);

    try {
      // 1. Calculate Amounts
      // Use correct decimals from balance hook or fallback (STRK/ETH=18, USDC/USDT=6)
      const decimals = balanceData?.decimals || 18;
      const amountWei = parseUnits(amount, decimals);

      const tongoRate = BigInt(currentToken.rate);
      const tongoUnits = amountWei / tongoRate;

      // 2. Prepare Op: Fund (Deposit)
      const op = await accountInstance.fund({
        sender: address!,
        amount: tongoUnits,
      });
      const fundCall = op.toCalldata();

      // 3. Prepare Op: Approve ERC20
      // We must approve the Tongo Contract Address (not account address) to spend our tokens
      const tongoContractAddress = currentToken.address;

      const approveCall = {
        contractAddress: currentToken.erc20, // Token Contract
        entrypoint: "approve",
        calldata: CallData.compile({
          spender: tongoContractAddress,
          amount: cairo.uint256(amountWei),
        }),
      };

      const tx = await account.executePaymasterTransaction(
        [approveCall, fundCall],
        {
          feeMode: {
            mode: "sponsored",
          },
        },
      );

      await provider.waitForTransaction(tx.transaction_hash);

      toast.success(`Shielded ${selectedSymbol} successfully!`, {
        id: toastId,
      });
      onClose();
      setAmount("");
    } catch (e: any) {
      console.error("Shield Error:", e);
      const isCancelled =
        e.message?.includes("User rejected") ||
        e.message?.includes("User abort") ||
        e.message?.includes("Execute failed");

      if (isCancelled) {
        toast.error("Transaction cancelled", { id: toastId });
        onClose();
      } else {
        toast.error("Failed to shield: " + (e.message || "Unknown error"), {
          id: toastId,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Lock size={24} className="text-black" />
            Shield Assets
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
              Asset to Shield
            </label>
            <div className="relative">
              <select
                value={selectedSymbol}
                onChange={(e) => {
                  setSelectedSymbol(e.target.value);
                  setAmount("");
                }}
                className="appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-black focus:border-black block w-full p-3 font-bold cursor-pointer"
              >
                {tokens.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
              Amount to Wrap
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent text-3xl font-mono font-bold outline-none placeholder:text-gray-300"
              />
              <button
                onClick={() => setAmount(publicBalance.toString())}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded"
              >
                MAX
              </button>
            </div>
            <div className="text-right text-xs text-gray-400 mt-1 flex justify-between">
              <span>Available:</span>
              <span>
                {loadingBalance ? (
                  <Loader2 size={10} className="animate-spin inline" />
                ) : (
                  `${publicBalance} ${selectedSymbol}`
                )}
              </span>
            </div>
          </div>

          <div className="flex justify-center -my-3 relative z-10">
            <div className="bg-white border border-gray-200 p-2 rounded-full shadow-sm text-gray-400">
              <ArrowDown size={16} />
            </div>
          </div>

          {/* Receive Section */}
          <div className="bg-black text-white p-4 rounded-2xl border border-gray-800">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
              You Receive (Shielded)
            </label>
            <div className="text-3xl font-mono font-bold">
              {amount || "0.00"}
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
              <Lock size={12} />
              <span>Only visible to you (Tongo Vault)</span>
            </div>
          </div>

          <button
            onClick={handleWrap}
            disabled={loading || !amount || Number(amount) <= 0}
            className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" /> Processing...
              </>
            ) : (
              <>Confirm Shielding</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
