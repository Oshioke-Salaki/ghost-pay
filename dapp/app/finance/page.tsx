"use client";
import { useState } from "react";
import { useAccount } from "@starknet-react/core";

import SwapModal from "@/components/SwapModal";
import WalletConnectButton from "@/components/ConnectWalletButton";
import PublicWallet from "./components/PublicWallet";
import PrivateVault from "./components/PrivateVault";

export default function TreasuryPage() {
  const { address } = useAccount();
  const [showSwap, setShowSwap] = useState(false);

  if (!address)
    return (
      <div className="p-20 text-center">
        <WalletConnectButton />
      </div>
    );

  return (
    <div className="py-12 px-6 md:px-20 max-w-7xl mx-auto">
      <SwapModal isOpen={showSwap} onClose={() => setShowSwap(false)} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Treasury Management
        </h1>
        <p className="text-gray-500">
          Manage public liquidity and private payroll reserves.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-stretch h-full">
        <PublicWallet address={address} setShowSwap={setShowSwap} />
        <PrivateVault />
      </div>
    </div>
  );
}
