"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAccount, useBalance } from "@starknet-react/core";
import {
  Building2,
  Wallet,
  Ghost,
  ArrowRight,
  Plus,
  TrendingUp,
  Users,
  CreditCard,
  Briefcase,
  Lock,
  Loader2,
} from "lucide-react";
import { useOrganizationStore } from "@/store/organizationStore";
import { useTongoAccount } from "@/hooks/useTongoAccount";
import { formatUnits } from "ethers";
import { supabase } from "@/utils/superbase/server";
import DashboardLocked from "./components/DashboardLocked";
import SwapModal from "@/components/SwapModal";
import { STRK_ADDR } from "@/lib/data";

export default function DashboardPage() {
  const { address } = useAccount();
  const { organizations, fetchOrganizations } = useOrganizationStore();
  const { tongoAccount, conversionRate, initializeTongo, isInitializing } =
    useTongoAccount();

  const [showSwap, setShowSwap] = useState(false);
  const [privateBalance, setPrivateBalance] = useState("0.00");
  const [globalStats, setGlobalStats] = useState({
    totalEmployees: 0,
    totalPayroll: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingPrivateBalance, setLoadingPrivateBalance] = useState(false);

  // New State for Liquidity Card Toggle
  const [balanceView, setBalanceView] = useState<"public" | "private">(
    "public"
  );

  // 1. Fetch Public Balance
  const { data: publicBalance, isLoading: loadingPublicBalance } = useBalance({
    address,
    token: STRK_ADDR,
    watch: true,
  });

  // 2. Fetch orangizaions & Aggregated Stats
  useEffect(() => {
    if (address) {
      fetchOrganizations(address);
    }
  }, [address, fetchOrganizations]);

  useEffect(() => {
    const loadGlobalStats = async () => {
      setLoadingStats(true);
      if (organizations.length === 0) {
        setLoadingStats(false);
        return;
      }

      // Aggregate stats across all organizations
      const { data: allEmployees } = await supabase
        .from("employees")
        .select("salary")
        .in(
          "organization_id",
          organizations.map((c) => c.id)
        );

      if (allEmployees) {
        const totalEmp = allEmployees.length;
        const totalPay = allEmployees.reduce(
          (sum, e) => sum + (Number(e.salary) || 0),
          0
        );
        setGlobalStats({ totalEmployees: totalEmp, totalPayroll: totalPay });
      }
      setLoadingStats(false);
    };

    if (organizations.length > 0) {
      loadGlobalStats();
    } else {
      setLoadingStats(false);
    }
  }, [organizations]);

  // 3. Fetch Private Balance
  useEffect(() => {
    const fetchPriv = async () => {
      if (!tongoAccount || !conversionRate) return;
      setLoadingPrivateBalance(true);
      try {
        const state = await tongoAccount.state();
        const bal = state.balance * conversionRate;
        setPrivateBalance(formatUnits(bal.toString(), 18));
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingPrivateBalance(false);
      }
    };
    if (tongoAccount) {
      fetchPriv();
      const i = setInterval(fetchPriv, 10000);
      return () => clearInterval(i);
    }
  }, [tongoAccount, conversionRate]);

  if (!address) {
    return <DashboardLocked />;
  }

  return (
    <div className="py-12 px-6 md:px-[120px] max-w-7xl mx-auto">
      <SwapModal isOpen={showSwap} onClose={() => setShowSwap(false)} />

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-2">
            Manage your organization's finances and payroll securely.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/finance"
            className="px-5 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2"
          >
            <Wallet size={18} /> Treasury
          </Link>
          <Link
            href="/organizations"
            className="px-5 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg flex items-center gap-2"
          >
            <Briefcase size={18} /> Manage Organizations
          </Link>
        </div>
      </div>

      {/* --- QUICK STATS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Card 1: Liquidity Overview (With Toggle) */}
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

          {/* Toggle Switch */}
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

          {/* Dynamic Balance Content */}
          <div>
            <div className="flex justify-between items-end mb-1">
              <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                {balanceView === "public" ? "Wallet Balance" : "Vault Balance"}
              </span>
            </div>

            <div className="mt-1">
              {balanceView === "public" ? (
                <span className="text-4xl font-mono font-bold text-gray-900 tracking-tighter flex items-center gap-2">
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
              ) : // Private View Logic
              tongoAccount ? (
                <span className="text-4xl font-mono font-bold text-purple-900 tracking-tighter flex items-center gap-2">
                  {loadingPrivateBalance ? (
                    <Loader2
                      className="animate-spin text-purple-400"
                      size={24}
                    />
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
                  <span className="text-2xl font-bold text-gray-300">
                    Locked
                  </span>
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

        {/* Card 2: Global Liability */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-gray-500 font-medium text-sm mb-4">
            <TrendingUp size={18} /> Monthly Liability
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              {loadingStats ? (
                <Loader2 className="animate-spin text-gray-400" size={24} />
              ) : (
                <>
                  {globalStats.totalPayroll.toFixed(2)}{" "}
                  <span className="text-lg text-gray-400 font-normal">
                    STRK
                  </span>
                </>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Total estimated payroll across all orgs
            </p>
          </div>
        </div>

        {/* Card 3: Headcount */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-gray-500 font-medium text-sm mb-4">
            <Users size={18} /> Total Headcount
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              {loadingStats ? (
                <Loader2 className="animate-spin text-gray-400" size={24} />
              ) : (
                globalStats.totalEmployees
              )}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Active recipients across {organizations.length} organizations
            </p>
          </div>
        </div>
      </div>

      {/* --- YOUR ORGANIZATIONS --- */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Your Organizations</h3>
        <Link
          href="/organizations"
          className="text-sm font-medium text-gray-500 hover:text-black flex items-center gap-1"
        >
          View All <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Card */}
        <Link
          href="/organizations"
          className="group border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer min-h-[180px]"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-black transition-colors mb-3">
            <Plus size={24} />
          </div>
          <p className="font-bold text-gray-900">Create New Organization</p>
          <p className="text-xs text-gray-500 mt-1">
            Setup a new payroll entity
          </p>
        </Link>

        {/* Organization List (Top 5) */}
        {organizations.slice(0, 5).map((organization) => (
          <Link
            key={organization.id}
            href={`/organizations/${organization.id}`}
            className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-gray-300 transition-all flex flex-col justify-between min-h-[180px]"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-linear-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-gray-600 group-hover:bg-black group-hover:text-white transition-colors">
                  <Building2 size={20} />
                </div>
                {/* Organization ID removed from display */}
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">
                {organization.name}
              </h3>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-black transition-colors mt-4">
              Manage Dashboard{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
