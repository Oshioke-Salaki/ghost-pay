"use client";
import React, { useState } from "react";
import {
  Lock,
  Ghost,
  Loader2,
  Wallet,
  Shield,
  ArrowLeftRight,
  RefreshCw,
  Settings2,
} from "lucide-react";
import { useAccount } from "@starknet-react/core";
import { useTongoAccount } from "@/hooks/useTongoAccount";
import { usePrivateBalance } from "@/hooks/usePrivateBalance";
import CopyButton from "@/components/CopyButton";
import { TONGO_CONTRACTS } from "@/lib/tongoData";
import VaultTokenRow from "./VaultTokenRow";
import ShieldModal from "@/components/finance/ShieldModal";
import SwapModal from "@/components/SwapModal";

export default function PersonalAssets() {
  const { address } = useAccount();
  const {
    tongoAccounts,
    initializeTongo,
    isInitializing,
    conversionRates,
    getAccount,
  } = useTongoAccount();

  const { privateBalances, refetchPrivateBalances } = usePrivateBalance({
    tongoAccounts,
    conversionRates,
    pollInterval: 30000, 
  });

  const [showShieldModal, setShowShieldModal] = useState(false);
  const [shieldMode, setShieldMode] = useState<"shield" | "unshield">("shield");
  const [showSwapModal, setShowSwapModal] = useState(false);

  const isVaultLocked = !tongoAccounts || Object.keys(tongoAccounts).length === 0;

  // -- STATE 1: NOT INITIALIZED --
  if (isVaultLocked) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border border-gray-200 text-center px-6">
        <div className="bg-white p-4 rounded-full shadow-lg mb-6 text-black">
          <Ghost size={48} />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-gray-900">
          Unlock Your Ghost Vault
        </h2>
        <p className="text-gray-500 max-w-md mb-8 text-lg">
          To view your shielded balances and manage your assets, you need to
          sign a message to derive your private keys for all supported tokens.
        </p>
        <button
          onClick={() => initializeTongo()}
          disabled={isInitializing}
          className="px-8 py-4 bg-black text-white rounded-xl font-bold text-lg hover:opacity-80 transition-opacity flex items-center gap-3 disabled:opacity-50"
        >
          {isInitializing ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              Decrypting Vault...
            </>
          ) : (
            <>
              <Lock size={20} />
              Unlock Vault
            </>
          )}
        </button>
      </div>
    );
  }

  const tokens = Object.keys(TONGO_CONTRACTS["mainnet"]);

  const openManager = () => {
    setShieldMode("shield"); // Default to shield, user can toggle
    setShowShieldModal(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in active-vault-view">
      
      {/* ADDRESS & INFO SECTION */}
      <div className="grid md:grid-cols-2 gap-6">
          {/* Public Wallet Info */}
          <div className="bg-white border border-gray-200 p-6 rounded-2xl flex flex-col justify-between h-full">
              <div className="mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900">
                      <Wallet size={20} /> Public Wallet
                  </h3>
                  <p className="text-gray-500 text-sm">Visible on Starknet.</p>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="flex-1 truncate font-mono text-xs text-gray-600">
                        {address || "Not Connected"}
                    </div>
                    {address && <CopyButton text={address} />}
              </div>
          </div>

          {/* Ghost Vault Info */}
          <div className="bg-gray-900 text-white p-6 rounded-2xl flex flex-col justify-between h-full">
              <div className="mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                      <Ghost size={20} /> Ghost Vault
                  </h3>
                  <p className="text-gray-400 text-sm">Encrypted & Shielded.</p>
              </div>
              <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-3 border border-gray-700">
                    <div className="flex-1 truncate font-mono text-xs text-gray-300">
                        {getAccount("STRK")?.tongoAddress() || "..."}
                    </div>
                    <CopyButton text={getAccount("STRK")?.tongoAddress() || ""} />
              </div>
          </div>
      </div>

      {/* GLOBAL ACTIONS - Merged Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={openManager}
            className="py-5 bg-black text-white rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg hover:bg-gray-800 transition-all text-lg"
          >
              <Shield size={22} />
              Manage Privacy (Shield/Unshield)
          </button>

          <button
            onClick={() => setShowSwapModal(true)}
            className="py-5 bg-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg hover:bg-purple-700 transition-all text-lg"
          >
              <RefreshCw size={22} />
              Swap on AVNU
          </button>
      </div>

      {/* ASSET LIST */}
      <div>
          <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Lock size={20} /> Your Portfolio
          </h4>
          <div className="space-y-3">
              {tokens.map((symbol) => (
                  <VaultTokenRow
                    key={symbol}
                    symbol={symbol}
                    privateBalance={privateBalances[symbol] || "0"}
                  />
              ))}
          </div>
      </div>

      {/* Unified Shield Modal */}
      <ShieldModal
        isOpen={showShieldModal}
        onClose={() => {
            setShowShieldModal(false);
            refetchPrivateBalances();
        }}
        tongoAccounts={tongoAccounts}
        privateBalances={privateBalances}
        initialMode={shieldMode}
      />

      {/* AVNU Swap Modal */}
      <SwapModal 
        isOpen={showSwapModal}
        onClose={() => setShowSwapModal(false)}
      />
    </div>
  );
}
