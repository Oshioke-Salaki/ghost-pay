import WalletConnectButton from "@/components/ConnectWalletButton";
import { ShieldAlert } from "lucide-react";
import React from "react";

function DashboardLocked() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 max-w-md w-full shadow-sm">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert size={32} className="text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
        <p className="text-gray-600 mb-8">
          Please connect your Starknet wallet to view payroll data and manage
          employees.
        </p>
        <div className="flex justify-center">
          <WalletConnectButton />
        </div>
      </div>
    </div>
  );
}

export default DashboardLocked;
