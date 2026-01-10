import { Loader2, TrendingUp, Users } from "lucide-react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import LiquidityOverview from "./LiquidityOverview";
import { supabase } from "@/utils/superbase/server";
import { Organization } from "@/store/organizationStore";
import { useUIStore } from "@/store/uiStore";

function QuickStats({
  setShowSwap,
  organizations,
}: {
  setShowSwap: Dispatch<SetStateAction<boolean>>;
  organizations: Organization[];
}) {
  const [globalStats, setGlobalStats] = useState({
    totalEmployees: 0,
    totalPayroll: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const hideAmounts = useUIStore((s) => s.hideAmounts);

  useEffect(() => {
    const loadGlobalStats = async () => {
      setLoadingStats(true);
      if (organizations.length === 0) {
        setLoadingStats(false);
        return;
      }

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <LiquidityOverview setShowSwap={setShowSwap} />

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 text-gray-500 font-medium text-sm mb-4">
          <TrendingUp size={18} /> Monthly Liability
        </div>
        <div>
          <p
            className={`text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2 transition-all duration-300 ${
              hideAmounts ? "blur-md select-none" : ""
            }`}
          >
            {loadingStats ? (
              <Loader2 className="animate-spin text-gray-400" size={24} />
            ) : (
              <>
                {globalStats.totalPayroll.toFixed(2)}{" "}
                <span className="text-lg text-gray-400 font-normal">STRK</span>
              </>
            )}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Total estimated payroll across all orgs
          </p>
        </div>
      </div>

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
  );
}

export default QuickStats;
