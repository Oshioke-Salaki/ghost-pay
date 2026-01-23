"use client";
import React, { useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  History,
  Lock,
  Ghost,
  Shield,
  Loader2,
} from "lucide-react";
import { useAccount } from "@starknet-react/core";
import { useTongoAccount } from "@/hooks/useTongoAccount";
import { usePublicBalance } from "@/hooks/usePublicBalance";
import { usePrivateBalance } from "@/hooks/usePrivateBalance";
import AssetCard from "./AssetCard";
import CopyButton from "@/components/CopyButton";
import WrapModal from "@/components/finance/WrapModal";
import UnshieldModal from "@/components/finance/UnshieldModal";
// import { pubKeyBase58ToAffine } from "@fatsolutions/tongo-sdk";

export default function PersonalView() {
  const { address } = useAccount();
  const {
    tongoAccounts,
    initializeTongo,
    isInitializing,
    conversionRates,
  } = useTongoAccount();

  const tongoAccount = tongoAccounts?.["STRK"];
  const conversionRate = conversionRates?.["STRK"];

  // Public Balance (STRK on Starknet)
  const { balance: publicBalanceStrk, isLoading: loadingPublic } = usePublicBalance(
    address
  );

  // Private Balance (tSTRK in Tongo Vault)
  // Poll every 5s for updates
  const { privateBalances, loadingPrivateBalance, refetchPrivateBalances } = usePrivateBalance({
    tongoAccounts,
    conversionRates,
    pollInterval: 60000,
  });

  const privateBalance = privateBalances?.["STRK"] || "0";
  const refetchPrivateBalance = refetchPrivateBalances;

  const [showWrap, setShowWrap] = useState(false);
  const [showUnshield, setShowUnshield] = useState(false);

  // -- STATE 1: NOT INITIALIZED --
  if (!tongoAccount) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border border-gray-200 text-center px-6">
        <div className="bg-white p-4 rounded-full shadow-lg mb-6 text-black">
          <Ghost size={48} />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-gray-900">
          Unlock Your Ghost Vault
        </h2>
        <p className="text-gray-500 max-w-md mb-8 text-lg">
          To view your shielded balance and receive private payments, you need to
          sign a message to derive your private keys.
        </p>
        <button
          onClick={initializeTongo}
          disabled={isInitializing}
          className="px-8 py-4 bg-black text-white rounded-xl font-bold text-lg hover:opacity-80 transition-opacity flex items-center gap-3 disabled:opacity-50"
        >
          {isInitializing ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              Deriving Keys...
            </>
          ) : (
            <>
              <Lock size={20} />
              Initialize Vault
            </>
          )}
        </button>
      </div>
    );
  }

  // -- STATE 2: ACTIVE VAULT --
  return (
    <div className="space-y-8 animate-in fade-in active-vault-view">
      {/* Modals */}
      <WrapModal
        isOpen={showWrap}
        onClose={() => {
          setShowWrap(false);
          refetchPrivateBalances();
        }}
        tongoAccounts={tongoAccounts || {}}
      />
      <UnshieldModal
        isOpen={showUnshield}
        onClose={() => {
          setShowUnshield(false);
          refetchPrivateBalances();
        }}
        privateBalance={privateBalance}
        tongoAccount={tongoAccount}
        defaultRecipient={address}
      />

      <div className="grid md:grid-cols-2 gap-8">
        {/* PUBLIC WALLET CARD */}
        <AssetCard
          title="Public Wallet"
          currency="STRK"
          balance={loadingPublic ? "..." : publicBalanceStrk.toFixed(2)}
          icon={<Wallet size={120} />}
          actions={
            <button
              onClick={() => setShowWrap(true)}
              className="flex-1 bg-black text-white py-3 px-4 rounded-xl font-bold hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
            >
              <Shield size={18} />
              Shield (Wrap)
            </button>
          }
        />

        {/* GHOST VAULT CARD (Private) */}
        <AssetCard
          variant="dark"
          title="Ghost Vault"
          currency="tSTRK"
          balance={loadingPrivateBalance ? "..." : Number(privateBalance).toFixed(2)}
          icon={<Ghost size={120} />}
          actions={
            <div className="flex w-full gap-3">
              <div className="flex-1 flex flex-col justify-end">
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">
                  Private Address
                </div>
                <div className="flex items-center gap-2 bg-gray-900 rounded-lg p-2 border border-gray-800">
                   <div className="flex-1 truncate font-mono text-xs text-gray-300">
                     {tongoAccount.tongoAddress()}
                   </div>
                   <CopyButton text={tongoAccount.tongoAddress()} />
                </div>
              </div>
              <button
                onClick={() => setShowUnshield(true)}
                className="bg-white text-black py-3 px-6 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowUpRight size={18} />
                Unshield
              </button>
            </div>
          }
        />
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
