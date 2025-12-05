import { STRK_ADDR } from "@/lib/data";
import { usePayrollStore } from "@/store/payrollStore";
import { useUIStore } from "@/store/uiStore";
import { useBalance } from "@starknet-react/core";
import { Banknote, Users, Wallet } from "lucide-react";
import React from "react";

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
  return (
    <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm relative group">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-600">
            <Wallet className="text-gray-400" size={20} /> Wallet Balance
          </div>

          {/* NEW: Top Up Button */}
          <button
            onClick={() => setShowSwap(true)}
            className="text-xs bg-black text-white px-3 py-1.5 rounded-full font-bold transition-opacity shadow-md hover:scale-105"
          >
            + Top Up
          </button>
        </div>

        <strong
          className={`text-3xl font-mono text-gray-900 block ${
            hideAmounts
              ? "blur-md select-none transition-all duration-300"
              : "blur-0 transition-all duration-300"
          }`}
        >
          {userBalance ? parseFloat(userBalance.formatted).toFixed(2) : "-"}{" "}
          STRK
        </strong>
      </div>
      <StatCard
        icon={<Users className="text-gray-400" size={20} />}
        label="Active Employees"
        value={employees.length}
      />
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

function StatCard({
  icon,
  label,
  value,
  isBlur = false,
}: {
  icon: any;
  label: string;
  value: string | number;
  isBlur?: boolean;
}) {
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-600">
        {icon} {label}
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
