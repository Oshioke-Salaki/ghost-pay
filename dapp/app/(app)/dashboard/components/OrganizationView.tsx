"use client";
import { useState } from "react";
import { useOrganizationStore } from "@/store/organizationStore";
import SwapModal from "@/components/SwapModal";
import WrapModal from "@/components/finance/WrapModal";
import QuickStats from "./QuickStats";
import TreasuryOverview from "./TreasuryOverview"; // Import explicitly
import RecentOrganizations from "./RecentOrganizations";
import { useTongoAccount } from "@/hooks/useTongoAccount";

export default function OrganizationView() {
  const { organizations } = useOrganizationStore();
  const [showSwap, setShowSwap] = useState(false);
  const [showWrap, setShowWrap] = useState(false);
  
  // We need tongoAccounts to pass to WrapModal
  const { tongoAccounts } = useTongoAccount();

  return (
    <>
      <SwapModal isOpen={showSwap} onClose={() => setShowSwap(false)} />
      <WrapModal 
        isOpen={showWrap} 
        onClose={() => setShowWrap(false)} 
        tongoAccounts={tongoAccounts}
      />
      
      {/* 1. Vault Assets Section (Top Priority) */}
      <TreasuryOverview />

      {/* 2. HR/Payroll Stats (2-Column Grid) */}
      <QuickStats 
        organizations={organizations} 
      />
      
      {/* 3. Recent Activity */}
      <RecentOrganizations organizations={organizations} />
    </>
  );
}
