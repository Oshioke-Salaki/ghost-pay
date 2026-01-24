"use client";
import React, { useEffect, useState } from "react";
import {
  History,
  Lock,
  Ghost,
  Loader2,
} from "lucide-react";
import { useAccount } from "@starknet-react/core";
import { useTongoAccount } from "@/hooks/useTongoAccount";
import TreasuryOverview from "./TreasuryOverview";
// import { pubKeyBase58ToAffine } from "@fatsolutions/tongo-sdk";

export default function PersonalView() {
  const { address } = useAccount();
  const {
    tongoAccounts,
    initializeTongo,
    isInitializing,
    conversionRates,
  } = useTongoAccount();




  // -- RENDER VIEW --
  // We no longer block on initialization. TreasuryOverview handles "Locked" state.

  // -- STATE 2: ACTIVE VAULT --
  return (
    <div className="space-y-8 animate-in fade-in active-vault-view">
      {/* Modals could be moved to TreasuryOverview or kept if triggers exist. For now removing unused references. */}

      <div className="grid md:grid-cols-1 gap-8">
         <TreasuryOverview />
      </div>

      {/* Recent Activity Placeholder (Phase 4) */}
      <div className="bg-white border text-black border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <History size={18} />
            Recent Activity
          </h3>
          <button className="text-sm text-gray-500 hover:text-black">
            View All
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
          <div className="bg-gray-50 p-4 rounded-full mb-4">
            <History size={32} className="opacity-50" />
          </div>
          <p className="font-medium text-gray-600">No recent transactions</p>
          <p className="text-sm mt-1">Payments you receive will appear here</p>
        </div>
      </div>
    </div>
  );
}
