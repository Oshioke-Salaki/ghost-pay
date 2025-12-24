"use client";
import { useEffect, useState } from "react";
import { useAccount } from "@starknet-react/core";
import { useOrganizationStore } from "@/store/organizationStore";

import SwapModal from "@/components/SwapModal";
import DashboardHeader from "./components/DashboardHeader";
import QuickStats from "./components/QuickStats";
import RecentOrganizations from "./components/RecentOrganizations";
import WalletRequired from "@/components/WalletRequired";

export default function DashboardPage() {
  const { address } = useAccount();
  const { organizations, fetchOrganizations } = useOrganizationStore();

  const [showSwap, setShowSwap] = useState(false);

  useEffect(() => {
    if (address) {
      fetchOrganizations(address);
    }
  }, [address, fetchOrganizations]);

  if (!address) {
    return (
      <WalletRequired
        description=" Please connect your Starknet wallet to view payroll data and manage
          employees."
      />
    );
  }

  return (
    <div className="py-12 px-6 md:px-[120px] max-w-7xl mx-auto">
      <SwapModal isOpen={showSwap} onClose={() => setShowSwap(false)} />
      <DashboardHeader />
      <QuickStats setShowSwap={setShowSwap} organizations={organizations} />
      <RecentOrganizations organizations={organizations} />
    </div>
  );
}
