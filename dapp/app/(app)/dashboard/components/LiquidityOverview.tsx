import { usePrivateBalance } from "@/hooks/usePrivateBalance";
import { useTongoAccount } from "@/hooks/useTongoAccount";
import { STRK_ADDR } from "@/lib/data";
import { useAccount, useBalance } from "@starknet-react/core";
import { CreditCard, Ghost, Loader2, Lock } from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useUIStore } from "@/store/uiStore";

function LiquidityOverview({
  setShowSwap,
}: {
  setShowSwap: Dispatch<SetStateAction<boolean>>;
}) {
  const { address } = useAccount();
  const { tongoAccounts, conversionRates, initializeTongo, isInitializing } =
    useTongoAccount();
  const hideAmounts = useUIStore((s) => s.hideAmounts);
  const [balanceView, setBalanceView] = useState<"public" | "private">(
    "public"
  );
  
  const { privateBalances, loadingPrivateBalance } = usePrivateBalance({
    tongoAccounts,
    conversionRates,
  });

  const privateBalance = privateBalances?.["STRK"] || "0";
  const tongoAccount = tongoAccounts?.["STRK"];

  const { data: publicBalance, isLoading: loadingPublicBalance } = useBalance({
    address,
    token: STRK_ADDR,
    watch: true,
  });
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
          <CreditCard size={18} /> Liquidity
        </div>
        <button
          onClick={() => setShowSwap(true)}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          Swap
        </button>
      </div>

      <div className="bg-gray-100 p-1 rounded-xl flex mb-6">
        <button
          onClick={() => setBalanceView("public")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            balanceView === "public"
              ? "bg-white shadow-sm text-black"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Public
        </button>
        <button
          onClick={() => setBalanceView("private")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            balanceView === "private"
              ? "bg-purple-600 text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {balanceView !== "private" && <Ghost size={12} />} Private
        </button>
      </div>

      <div>
        <div className="flex justify-between items-end mb-1">
          <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">
            {balanceView === "public" ? "Wallet Balance" : "Vault Balance"}
          </span>
        </div>

        <div className="mt-1">
          {balanceView === "public" ? (
            <span
              className={`text-4xl font-bold text-gray-900 tracking-tighter flex items-center gap-2 transition-all duration-300 ${
                hideAmounts ? "blur-md select-none" : ""
              }`}
            >
              {loadingPublicBalance ? (
                <Loader2 className="animate-spin text-gray-400" size={24} />
              ) : (
                <>
                  {publicBalance
                    ? parseFloat(publicBalance.formatted).toFixed(2)
                    : "0.00"}{" "}
                  <span className="text-xl text-gray-400 font-normal">
                    STRK
                  </span>
                </>
              )}
            </span>
          ) : tongoAccount ? (
            <span
              className={`text-4xl font-bold text-purple-900 tracking-tighter flex items-center gap-2 transition-all duration-300 ${
                hideAmounts ? "blur-md select-none" : ""
              }`}
            >
              {loadingPrivateBalance ? (
                <Loader2 className="animate-spin text-purple-400" size={24} />
              ) : (
                <>
                  {parseFloat(privateBalance).toFixed(2)}{" "}
                  <span className="text-xl text-purple-400 font-normal">
                    tSTRK
                  </span>
                </>
              )}
            </span>
          ) : (
            <div className="flex flex-col items-start gap-3">
              <span className="text-2xl font-bold text-gray-300">Locked</span>
              <button
                onClick={() => initializeTongo()}
                disabled={isInitializing}
                className="flex items-center gap-1.5 text-xs bg-purple-100 text-purple-700 px-3 py-2 rounded-lg hover:bg-purple-200 transition-colors font-bold w-full justify-center"
              >
                {isInitializing ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  <Lock size={14} />
                )}
                {isInitializing ? "Decrypting..." : "Unlock Vault"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LiquidityOverview;
