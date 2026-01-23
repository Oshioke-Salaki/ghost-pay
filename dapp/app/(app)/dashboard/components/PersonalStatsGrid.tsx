"use client";
import { Loader2, TrendingUp, Building2 } from "lucide-react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import LiquidityOverview from "./LiquidityOverview";
import { useUIStore } from "@/store/uiStore";
import { useAccount } from "@starknet-react/core";
import { supabase } from "@/utils/superbase/server";

function PersonalStatsGrid({
  setShowSwap,
}: {
  setShowSwap: Dispatch<SetStateAction<boolean>>;
}) {
  const hideAmounts = useUIStore((s) => s.hideAmounts);
  const { address } = useAccount();

  const [stats, setStats] = useState({
    monthlyIncome: 0,
    activeOrgs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!address) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch all employee records where the address matches the connected user
        const { data: employeeRecords, error } = await supabase
          .from("employees")
          .select("salary, organization_id")
          .eq("address", address)
          .eq("is_active", true);

        if (error) throw error;

        if (employeeRecords) {
          // Calculate Total Monthly Income
          const totalIncome = employeeRecords.reduce(
            (sum, record) => sum + Number(record.salary),
            0
          );

          // Calculate Unique Active Organizations
          const uniqueOrgs = new Set(
            employeeRecords.map((r) => r.organization_id)
          ).size;

          setStats({
            monthlyIncome: totalIncome,
            activeOrgs: uniqueOrgs,
          });
        }
      } catch (err) {
        console.error("Failed to fetch personal stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [address]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {/* 1. Liquidity (Wallet/Vault) */}
      <LiquidityOverview setShowSwap={setShowSwap} />

      {/* 2. Monthly Income Estimation */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 text-gray-500 font-medium text-sm mb-4">
          <TrendingUp size={18} /> Est. Monthly Income
        </div>
        <div>
          <p
            className={`text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2 transition-all duration-300 ${
              hideAmounts ? "blur-md select-none" : ""
            }`}
          >
            {loading ? (
              <Loader2 className="animate-spin text-gray-400" size={24} />
            ) : (
              <>
                {stats.monthlyIncome.toFixed(2)}{" "}
                <span className="text-lg text-gray-400 font-normal">STRK</span>
              </>
            )}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Based on active employment contracts
          </p>
        </div>
      </div>

      {/* 3. Active Employment */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 text-gray-500 font-medium text-sm mb-4">
          <Building2 size={18} /> Active Employers
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            {loading ? (
               <Loader2 className="animate-spin text-gray-400" size={24} />
            ) : (
               stats.activeOrgs
            )}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Organizations you work for
          </p>
        </div>
      </div>
    </div>
  );
}

export default PersonalStatsGrid;
