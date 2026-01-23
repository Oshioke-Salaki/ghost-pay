"use client";
import { useEffect, useState } from "react";
import { useAccount } from "@starknet-react/core";
import { useOrganizationStore } from "@/store/organizationStore";
import { useViewModeStore } from "@/store/viewModeStore";

import DashboardHeader from "./components/DashboardHeader";
import WalletRequired from "@/components/WalletRequired";
import OrganizationView from "./components/OrganizationView";
import PersonalOverview from "./components/PersonalOverview";

import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { address } = useAccount();
  const { fetchOrganizations } = useOrganizationStore();
  const { mode } = useViewModeStore();

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
    <div className="py-12 px-6 md:px-[120px] max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DashboardHeader />
      
      {mode === "organization" ? <OrganizationView /> : <PersonalOverview />}
    </div>
  );
}
