import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Loader2, Lock, Shield, Plus, Wallet, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useTongoAccount } from "@/hooks/useTongoAccount";
import { usePrivateBalance } from "@/hooks/usePrivateBalance";
import { TONGO_CONTRACTS } from "@/lib/tongoData";
import TokenCard from "./TokenCard";
import Link from "next/link";

export default function TreasuryOverview() {
  const { tongoAccounts, initializeTongo, isInitializing, conversionRates } =
    useTongoAccount();
  const { privateBalances, loadingPrivateBalance } = usePrivateBalance({
    tongoAccounts,
    conversionRates,
  });

  const [viewMode, setViewMode] = useState<"public" | "private">("private");
  const tokens = Object.keys(TONGO_CONTRACTS["mainnet"]);
  const isVaultLocked = !tongoAccounts || Object.keys(tongoAccounts).length === 0;

      useEffect(()=>{
      console.log(tokens, "tokens keys")
    }, [tokens])
  return (
    <div className="mb-8 p-1">
      {/* Header Section */}
      <div className="flex flex-col items-start md:flex-row md:justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {viewMode === "private" ? <Lock size={24} /> : <Wallet size={24} />}
                {viewMode === "private" ? "Ghost Vault" : "Public Wallet"}
              </h2>
              
              {/* Toggle Switch */}
              <div className="bg-gray-100 p-1 rounded-lg flex items-center ml-2">
                  <button 
                    onClick={() => setViewMode("public")}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${viewMode === "public" ? "bg-white shadow-sm text-black" : "text-gray-400 hover:text-gray-600"}`}
                  >
                      Public
                  </button>
                  <button 
                    onClick={() => setViewMode("private")}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${viewMode === "private" ? "bg-white shadow-sm text-purple-700" : "text-gray-400 hover:text-gray-600"}`}
                  >
                      Private
                  </button>
              </div>
          </div>
          
          <p className="text-sm text-gray-500 max-w-lg leading-relaxed">
            These are your <strong className={viewMode === "private" ? "text-purple-700" : "text-black"}>{viewMode}</strong> token balances currently available in your {viewMode === "private" ? "shielded Ghost Vault" : "public Starknet wallet"}.
            {viewMode === "private" && " Balances here are encrypted and invisible on-chain."}
          </p>
        </div>

        <div className="flex items-center gap-2">
            {viewMode === "private" && isVaultLocked ? (
            <button
                onClick={() => initializeTongo()}
                disabled={isInitializing}
                className="flex items-center gap-2 text-sm bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition-all font-bold shadow-lg shadow-gray-200"
            >
                {isInitializing ? (
                <Loader2 className="animate-spin" size={16} />
                ) : (
                <Shield size={16} />
                )}
                {isInitializing ? "Decrypting..." : "Unlock Vault"}
            </button>
            ) : (
            <Link
                href="/vault"
                className="flex items-center gap-2 text-sm bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition-all font-bold shadow-lg shadow-gray-200"
            >
                <ArrowRight size={16} />
                Manage In Vault
            </Link>
            )}
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {tokens.map((symbol) => (
            <TokenCard 
                key={symbol}
                symbol={symbol}
                viewMode={viewMode}
                privateBalance={privateBalances[symbol]}
                loadingPrivate={loadingPrivateBalance}
                isVaultLocked={isVaultLocked}
            />
        ))}
      </div>
    </div>
  );
}
