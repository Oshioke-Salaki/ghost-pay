"use client";
import { useAccount } from "@starknet-react/core";
import AddEmployeeForm from "./components/AddEmployeeForm";
import CSVUploader from "./components/CSVUploader";
import EmployeeTable from "./components/EmployeeTable";
import { Users, ShieldAlert } from "lucide-react";
import WalletConnectButton from "@/components/ConnectWalletButton";
import MagicInput from "@/components/MagicInput";

export default function EmployeesPage() {
  const { address } = useAccount();

  if (!address) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 max-w-md w-full shadow-sm">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={32} className="text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-8">
            Please connect your wallet to manage your employee roster.
          </p>
          <div className="flex justify-center">
            <WalletConnectButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-6 md:px-[120px] max-w-7xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Users className="text-black" /> Manage Employees
        </h2>
        <p className="text-gray-500 mt-2">
          Add team members manually or upload a CSV to populate your payroll.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 items-stretch">
        {/* 1. Manual Add */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4 border-b border-gray-100 pb-2">
            Manual Entry
          </h3>
          <AddEmployeeForm />
        </div>

        {/* 2. Magic AI Input (New!) */}
        <div className="h-full">
          <MagicInput />
        </div>

        {/* 3. Bulk Upload */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-full">
          <h3 className="text-lg font-bold mb-4 border-b border-gray-100 pb-2">
            Bulk CSV
          </h3>
          <CSVUploader />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-10">
        <EmployeeTable />
      </div>
    </div>
  );
}
