"use client";
import React from "react";
import { useAccount } from "@starknet-react/core";
import { useViewModeStore } from "@/store/viewModeStore";
import WalletConnectButton from "@/components/ConnectWalletButton";
import IncomeHub from "./components/IncomeHub";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function WorkPage() {
  const { address } = useAccount();
  const { mode } = useViewModeStore();

  if (!address) {
    return (
      <div className="p-20 text-center">
        <WalletConnectButton />
      </div>
    );
  }

  // Purely conceptual: Organization Mode doesn't really have a "Work" page in the same sense, 
  // or it might be the "Employees" management list. 
  // For now, if someone accesses /work in Org mode, we might redirect or show a placeholder.
  if (mode === "organization") {
      return (
          <div className="py-20 text-center">
              <h1 className="text-2xl font-bold mb-4">Organization Workspace</h1>
              <p className="text-gray-500 mb-8">Switch to Personal Mode to access your Income Hub.</p>
              <Link href="/dashboard" className="text-blue-600 hover:underline">
                  Back to Dashboard
              </Link>
          </div>
      )
  }

  return (
    <div className="py-12 px-6 md:px-[120px] max-w-7xl mx-auto">
      <div className="mb-8">
        <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-4 transition-colors"
        >
            <ArrowLeft size={16} />
            Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          Income Hub
        </h1>
        <p className="text-gray-500">
          Manage your professional identity, income proofs, and invoices.
        </p>
      </div>

      <IncomeHub />
    </div>
  );
}
