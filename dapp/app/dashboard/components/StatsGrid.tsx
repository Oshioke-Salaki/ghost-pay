"use client";
import { useTongoAccount } from "@/hooks/useTongoAccount";
import { STRK_ADDR } from "@/lib/data";
import { formatWeiToAmount } from "@/lib/utils";
import { usePayrollStore } from "@/store/payrollStore";
import { useUIStore } from "@/store/uiStore";
import { useBalance } from "@starknet-react/core";
import {
  Banknote,
  Ghost,
  Loader2,
  Lock,
  RefreshCw,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { formatUnits } from "ethers";

function StatsGrid({
  address,
  setShowSwap,
}: {
  address: `0x${string}`;
  setShowSwap: (val: boolean) => void;
}) {
  const employees = usePayrollStore((s) => s.employees);
  const total = employees.reduce((s, e) => s + Number(e.salary), 0);
  const hideAmounts = useUIStore((s) => s.hideAmounts);

  const { data: userBalance } = useBalance({
    address,
    token: STRK_ADDR,
    refetchInterval: 10000,
    watch: true,
  });

  // Tongo Hooks
  const { tongoAccount, initializeTongo, isInitializing, conversionRate } =
    useTongoAccount();
  const [privateBalance, setPrivateBalance] = useState("0.0");

  // Fetch Private Balance
  useEffect(() => {
    const fetchPrivateBalance = async () => {
      if (!tongoAccount || !conversionRate) return;
      try {
        const state = await tongoAccount.state();
        // Calculate balance: units * rate = wei
        const balanceInWei = state.balance * conversionRate;
        setPrivateBalance(formatUnits(balanceInWei.toString(), 18));
      } catch (e) {
        console.error("Failed to fetch private balance", e);
      }
    };

    if (tongoAccount) {
      fetchPrivateBalance();
      const interval = setInterval(fetchPrivateBalance, 10000);
      return () => clearInterval(interval);
    }
  }, [tongoAccount, conversionRate]);

  return (
    <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. Public Balance with Swap Action */}
      <StatCard
        icon={<Wallet className="text-gray-400" size={20} />}
        label="Public Wallet"
        value={`${
          userBalance ? parseFloat(userBalance.formatted).toFixed(2) : "-"
        } STRK`}
        isBlur={hideAmounts}
        action={
          <button
            onClick={() => setShowSwap(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black text-white text-xs font-bold hover:bg-gray-800 transition-all shadow-sm hover:scale-105"
          >
            <RefreshCw size={12} /> Swap
          </button>
        }
      />

      {/* 2. Private Vault */}
      <div className="p-6 bg-purple-50 border border-purple-100 rounded-xl shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Ghost size={64} className="text-purple-600" />
        </div>

        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2 text-sm font-bold text-purple-700">
            <ShieldCheck className="text-purple-500" size={20} /> Private Vault
          </div>
          {!tongoAccount && (
            <button
              onClick={() => initializeTongo()}
              disabled={isInitializing}
              className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-full hover:bg-purple-700 transition-colors flex items-center gap-1 shadow-sm"
            >
              {isInitializing ? (
                <Loader2 className="animate-spin" size={12} />
              ) : (
                <Lock size={12} />
              )}
              {isInitializing ? "Decrypting..." : "Unlock"}
            </button>
          )}
        </div>

        <div className="relative z-10">
          {tongoAccount ? (
            <>
              <strong
                className={`text-3xl font-mono text-purple-900 block ${
                  hideAmounts ? "blur-md select-none" : ""
                }`}
              >
                {parseFloat(privateBalance).toFixed(2)}{" "}
                <span className="text-lg">tSTRK</span>
              </strong>
              <div className="mt-2 flex gap-2">
                <Link
                  href="/finance"
                  className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw size={12} /> Manage Liquidity
                </Link>
              </div>
            </>
          ) : (
            <div className="h-9 flex items-center">
              <span className="text-sm text-purple-400 italic font-medium">
                Vault Locked
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Total Payroll */}
      <StatCard
        icon={<Banknote className="text-gray-400" size={20} />}
        label="Total Payroll"
        value={`${total.toFixed(2)} STRK`}
        isBlur={hideAmounts}
      />
    </div>
  );
}

export default StatsGrid;

// Updated Helper Component with 'action' prop support
function StatCard({
  icon,
  label,
  value,
  isBlur = false,
  action,
}: {
  icon: any;
  label: string;
  value: string | number;
  isBlur?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow relative">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
          {icon} {label}
        </div>
        {/* Render the optional action button (e.g. Swap) */}
        {action && <div>{action}</div>}
      </div>

      <strong
        className={`text-3xl font-mono text-gray-900 block ${
          isBlur
            ? "blur-md select-none transition-all duration-300"
            : "blur-0 transition-all duration-300"
        }`}
      >
        {value}
      </strong>
    </div>
  );
}
