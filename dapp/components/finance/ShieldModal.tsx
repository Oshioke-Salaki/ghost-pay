"use client";
import React, { useState, useEffect } from "react";
import { X, ArrowDown, Loader2, Wallet, Lock, ChevronDown } from "lucide-react";
import { parseUnits } from "ethers";
import toast from "react-hot-toast";
import { useAccount, useBalance, useProvider } from "@starknet-react/core";
import { cairo, CallData } from "starknet";
import { TONGO_CONTRACTS } from "@/lib/tongoData";

// Hardcoded Logo URLs (matching VaultTokenRow)
const TOKEN_LOGOS: Record<string, string> = {
  STRK: "/starknetlogo.svg",
  ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026",
  USDC: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026",
  USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=026",
  WBTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026",
};

type ShieldModalProps = {
  isOpen: boolean;
  onClose: () => void;
  tongoAccounts: Record<string, any>;
  privateBalances: Record<string, string>; // { STRK: "10.0", ... }
  initialMode?: "shield" | "unshield";
};

export default function ShieldModal({
  isOpen,
  onClose,
  tongoAccounts,
  privateBalances,
  initialMode = "shield",
}: ShieldModalProps) {
  const { address, account } = useAccount();
  const { provider } = useProvider();

  const [mode, setMode] = useState<"shield" | "unshield">(initialMode);
  const [selectedSymbol, setSelectedSymbol] = useState("STRK");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setAmount("");
    }
  }, [isOpen, initialMode]);

  const tokens = Object.keys(TONGO_CONTRACTS["mainnet"]);
  const currentToken = TONGO_CONTRACTS["mainnet"][selectedSymbol as keyof typeof TONGO_CONTRACTS["mainnet"]];

  // -- PUBLIC BALANCE --
  const { data: publicData, isLoading: loadingPublic } = useBalance({
    address,
    token: currentToken?.erc20 as `0x${string}`,
    refetchInterval: 5000,
  });
  const publicBalance = publicData ? parseFloat(publicData.formatted) : 0.0;

  // -- PRIVATE BALANCE --
  const privateBalanceStr = privateBalances[selectedSymbol] || "0";
  const privateBalance = parseFloat(privateBalanceStr);

  const toggleMode = () => {
    setMode((prev) => (prev === "shield" ? "unshield" : "shield"));
    setAmount("");
  };

  const setPercentage = (percent: number) => {
    const bal = mode === "shield" ? publicBalance : privateBalance;
    if (!bal && bal !== 0) return;
    const val = bal * percent;
    setAmount(val.toString());
  };

  const executeTransaction = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Balance Checks
    if (mode === "shield" && Number(amount) > publicBalance) {
      toast.error("Insufficient public balance");
      return;
    }
    if (mode === "unshield" && Number(amount) > privateBalance) {
      toast.error("Insufficient shielded balance");
      return;
    }

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
    const toastId = toast.loading(mode === "shield" ? `Shielding ${selectedSymbol}...` : `Unshielding ${selectedSymbol}...`);

    try {
      const decimals = publicData?.decimals || 18; 
      const amountWei = parseUnits(amount, decimals);
      const tongoRate = BigInt(currentToken.rate);
      const tongoUnits = amountWei / tongoRate;

      if (mode === "shield") {
         const op = await accountInstance.fund({
            sender: address!, 
            amount: tongoUnits,
         });
         const fundCall = op.toCalldata();

         const approveCall = {
            contractAddress: currentToken.erc20,
            entrypoint: "approve",
            calldata: CallData.compile({
                spender: currentToken.address, // Tongo Contract
                amount: cairo.uint256(amountWei),
            }),
         };

         const tx = await account.execute([approveCall, fundCall]);
         await provider.waitForTransaction(tx.transaction_hash);
      } else {
         await accountInstance.withdraw(amountWei, address);
      }

      toast.success("Transaction executed successfully!", { id: toastId });
      onClose();
      setAmount("");
    } catch (e: any) {
      console.error("Exec Error:", e);
      const isCancelled = e.message?.includes("User rejected") || e.message?.includes("User abort") || e.message?.includes("Execute failed");
      if (isCancelled) {
         toast.error("Transaction cancelled", { id: toastId });
      } else {
         toast.error("Failed: " + (e.message || "Unknown error"), { id: toastId });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isShield = mode === "shield";
  const sourceBalance = isShield ? publicBalance : (privateBalance || 0);
  const destBalance = isShield ? (privateBalance || 0) : publicBalance; 
  
  const ghostSymbol = `t${selectedSymbol}`;
  const publicSymbol = selectedSymbol;

  const selectLabel = isShield ? publicSymbol : ghostSymbol;
  const destLabel = isShield ? ghostSymbol : publicSymbol;

  const logoUrl = TOKEN_LOGOS[selectedSymbol] || "/starknetlogo.svg";

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-2 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 pb-2">
           <h2 className="text-2xl font-bold text-gray-900">
              {isShield ? "Shield Assets" : "Unshield Assets"}
           </h2>
           <button 
               onClick={onClose}
               className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-black transition-colors"
           >
             <X size={24} />
           </button>
        </div>

        {/* CONTAINER with structural gap */}
        <div className="p-4 pt-2">
            
            {/* INPUT CARD (Source) */}
            <div className="bg-gray-50 p-6 pb-8 rounded-3xl border border-gray-100 hover:border-gray-200 transition-colors z-0 relative">
                
                {/* Top Row: Label + Percentage Box */}
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                        {isShield ? "From Public Wallet" : "From Ghost Vault"}
                    </span>
                    
                    <div className="flex items-center gap-2">
                         <button onClick={() => setPercentage(0.25)} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg text-xs font-bold text-gray-600 transition-colors">
                            25%
                         </button>
                         <button onClick={() => setPercentage(0.50)} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg text-xs font-bold text-gray-600 transition-colors">
                            50%
                         </button>
                         <button onClick={() => setPercentage(1.0)} className="px-3 py-1 bg-black hover:bg-gray-800 rounded-lg text-xs font-bold text-white transition-colors">
                            Max
                         </button>
                    </div>
                </div>
                
                {/* Middle Row: Input + Token Selector */}
                <div className="flex items-start justify-between gap-4">
                    <input 
                        type="number" 
                        placeholder="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-transparent text-4xl font-mono font-bold text-gray-900 placeholder:text-gray-300 outline-none flex-1 w-full min-w-0"
                    />
                    
                    <div className="flex flex-col items-end gap-2 shrink-0">
                         {/* Enhanced Token Selector with Logo */}
                        <div className="relative group">
                             <div className="flex items-center gap-2 bg-white border border-gray-200 py-2 pl-2 pr-8 rounded-full shadow-sm hover:bg-gray-50 transition-colors cursor-pointer pointer-events-none">
                                {/* Logo */}
                                <div className="w-6 h-6 rounded-full bg-gray-100 p-0.5 flex items-center justify-center overflow-hidden">
                                     {/* eslint-disable-next-line @next/next/no-img-element */}
                                     <img src={logoUrl} alt={selectedSymbol} className="w-full h-full object-cover" />
                                </div>
                                <span className="font-bold text-base text-gray-900">{selectLabel}</span>
                             </div>

                             {/* Hidden Select overlay for functionality */}
                             <select 
                                value={selectedSymbol}
                                onChange={(e) => setSelectedSymbol(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                             >
                                {tokens.map(t => <option key={t} value={t}>{t}</option>)}
                             </select>
                             
                             <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                        </div>
                        
                        {/* Source Balance Display */}
                        <span className="text-xs text-gray-500 font-mono">
                            Bal: {sourceBalance.toFixed(4)}
                        </span>
                    </div>
                </div>
            </div>

            {/* GAP CONTAINER - ARROW ALIGNMENT */}
            <div className="relative h-4 z-10">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <button 
                        onClick={toggleMode}
                        className="bg-white border-4 border-white rounded-xl p-2 shadow-lg text-gray-500 hover:text-black hover:scale-110 transition-all hover:bg-gray-50 bg-white"
                    >
                        <ArrowDown size={24} strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* OUTPUT CARD (Destination) */}
            <div className="bg-gray-50 p-6 pt-8 rounded-3xl border border-gray-100 relative z-0">
                 <div className="flex justify-between mb-4">
                    <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                        {isShield ? "To Ghost Vault" : "To Public Wallet"}
                    </span>
                 </div>
                 
                 <div className="flex items-center justify-between gap-4">
                    <div className="text-4xl font-mono font-bold text-gray-400">
                        {amount || "0"}
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 shrink-0">
                        {/* Destination Token Badge */}
                        <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-full shadow-sm">
                             <div className="w-5 h-5 rounded-full bg-gray-100 p-0.5 flex items-center justify-center overflow-hidden">
                                 {/* eslint-disable-next-line @next/next/no-img-element */}
                                 <img src={logoUrl} alt={selectedSymbol} className="w-full h-full object-cover" />
                             </div>
                            <span className="text-base font-bold text-gray-900">{destLabel}</span>
                        </div>
                        
                        {/* Destination Balance Display - Now Below Badge */}
                        <span className="text-xs text-gray-500 font-mono">
                            Bal: {destBalance.toFixed(4)}
                        </span>
                    </div>
                 </div>
            </div>

            {/* RATE INFO */}
            <div className="px-2 pt-2">
                 <div className="flex justify-between items-center text-xs text-gray-400 font-medium">
                    <span>Rate</span>
                    <span>1 {publicSymbol} = 1 {ghostSymbol}</span>
                 </div>
            </div>

            {/* ACTION BUTTON */}
            <button
                onClick={executeTransaction}
                disabled={loading || !amount || parseFloat(amount) <= 0}
                className={`w-full py-5 rounded-2xl font-bold text-xl shadow-lg flex items-center justify-center gap-3 transition-all mt-6
                    ${isShield 
                        ? "bg-black text-white hover:bg-gray-900" 
                        : "bg-white border-2 border-black text-black hover:bg-gray-50"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                ) : (
                    isShield ? <Lock size={24} /> : <Wallet size={24} />
                )}
                {loading ? "Processing..." : (isShield ? "Shield Assets" : "Unshield Assets")}
            </button>
            
        </div>
      </div>
    </div>
  );
}
