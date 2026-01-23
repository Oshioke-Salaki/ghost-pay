"use client";
import { useState } from "react";
import { useAccount } from "@starknet-react/core";
import { useViewModeStore } from "@/store/viewModeStore";

import SwapModal from "@/components/SwapModal";
import WalletConnectButton from "@/components/ConnectWalletButton";
import PersonalAssets from "./components/PersonalAssets";

export default function TreasuryPage() {
  const { address } = useAccount();
  const { mode } = useViewModeStore();
  const [showSwap, setShowSwap] = useState(false);

  if (!address)
    return (
      <div className="p-20 text-center">
        <WalletConnectButton />
      </div>
    );

  // -- PERSONAL MODE: My Assets --
  if (mode === "personal") {
    return (
      <div className="py-12 px-6 md:px-20 max-w-7xl mx-auto">
        <SwapModal isOpen={showSwap} onClose={() => setShowSwap(false)} />
        <div className="mb-8">
           <h1 className="text-3xl font-bold text-gray-900">Personal Vault</h1>
           <p className="text-gray-500">Manage your public wallet and private Ghost Vault.</p>
        </div>

        <PersonalAssets />
      </div>
    );
  }

  // -- ORGANIZATION MODE: Treasury --
  return (
    <div className="py-12 px-6 md:px-20 max-w-7xl mx-auto">
      <SwapModal isOpen={showSwap} onClose={() => setShowSwap(false)} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Organization Vault
        </h1>
        <p className="text-gray-500">
          Manage public liquidity and private payroll reserves.
        </p>
      </div>

      {/* Unified Multi-Token View */}
      <PersonalAssets />
    </div>
  );
}
