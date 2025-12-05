"use client";
import EmployeeTable from "../employees/components/EmployeeTable";
import { useAccount } from "@starknet-react/core";
import { useState } from "react";
import SwapModal from "@/components/SwapModal";
import DashboardLocked from "./components/DashboardLocked";
import StatsGrid from "./components/StatsGrid";

export default function Dashboard() {
  const { address } = useAccount();
  const [showSwap, setShowSwap] = useState(false);

  if (!address) {
    return <DashboardLocked />;
  }

  return (
    <div className="py-10 px-6 md:px-[120px] max-w-7xl mx-auto">
      <SwapModal isOpen={showSwap} onClose={() => setShowSwap(false)} />
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-gray-500 mt-1">Overview of your payroll roster.</p>
        </div>
      </div>
      <StatsGrid address={address} setShowSwap={setShowSwap} />
      <EmployeeTable />
    </div>
  );
}
