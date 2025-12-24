import { STRK_ADDR } from "@/lib/data";
import { useBalance } from "@starknet-react/core";
import { CheckCircle2, Ghost, Lock, ShieldCheck, Wallet } from "lucide-react";
import React from "react";

function FundingSource({
  tongoAccount,
  initializeTongo,
  address,
  setSource,
  source,
  privateBalance,
  isInitializing,
}: {
  tongoAccount: any;
  initializeTongo: any;
  address: `0x${string}`;
  source: "public" | "private";
  setSource: (val: "public" | "private") => void;
  privateBalance: string;
  isInitializing: boolean;
}) {
  const { data: publicBalance } = useBalance({
    address,
    token: STRK_ADDR,
    watch: true,
  });
  return (
    <div className="space-y-4">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide px-1">
        Funding Source
      </p>

      <button
        onClick={() => setSource("public")}
        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
          source === "public"
            ? "border-black bg-white shadow-md"
            : "border-transparent bg-gray-100 hover:bg-gray-200 text-gray-500"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 font-bold">
            <Wallet size={18} /> Public Wallet
          </div>
          {source === "public" && (
            <CheckCircle2 size={18} className="text-black" />
          )}
        </div>
        <p className="text-xs opacity-70 mb-2">Visible on-chain transaction.</p>
        <p className="text-sm font-mono font-bold">
          {publicBalance
            ? parseFloat(publicBalance.formatted).toFixed(2)
            : "0.00"}{" "}
          STRK
        </p>
      </button>

      <button
        onClick={() => {
          setSource("private");
          if (!tongoAccount) initializeTongo();
        }}
        className={`w-full text-left p-4 rounded-xl border-2 transition-all relative overflow-hidden ${
          source === "private"
            ? "border-purple-600 bg-purple-50 text-purple-900 shadow-md"
            : "border-transparent bg-gray-100 hover:bg-gray-200 text-gray-500"
        }`}
      >
        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="flex items-center gap-2 font-bold">
            <Ghost size={18} /> Ghost Vault
          </div>
          {tongoAccount ? (
            source === "private" && (
              <CheckCircle2 size={18} className="text-purple-600" />
            )
          ) : (
            <Lock size={16} />
          )}
        </div>
        <p className="text-xs opacity-70 mb-2 relative z-10">
          Anonymous transfer via Tongo.
        </p>

        {tongoAccount ? (
          <p className="text-sm font-mono font-bold relative z-10">
            {parseFloat(privateBalance).toFixed(2)} tSTRK
          </p>
        ) : (
          <div className="flex items-center gap-1 text-xs font-bold bg-white/50 w-fit px-2 py-1 rounded">
            {isInitializing ? "Unlocking..." : "Click to Unlock"}
          </div>
        )}

        {source === "private" && (
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-xl -mr-5 -mt-5"></div>
        )}
      </button>

      <div className="bg-blue-50 p-4 rounded-xl flex gap-3 items-start">
        <ShieldCheck size={20} className="text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800 leading-relaxed">
          <strong>Pro Tip:</strong> Use the Ghost Vault for payments you want to
          keep off your public ledger history.
        </p>
      </div>
    </div>
  );
}

export default FundingSource;
