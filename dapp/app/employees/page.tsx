"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAccount } from "@starknet-react/core";
import {
  ArrowLeft,
  Users,
  ShieldAlert,
  UserPlus,
  Upload,
  Building2,
} from "lucide-react";
import { useOrganizationStore } from "@/store/organizationStore";

// Components
import AddEmployeeForm from "@/app/employees/components/AddEmployeeForm";
import MagicInput from "@/components/MagicInput";
import CSVUploader from "@/app/employees/components/CSVUploader";
import EmployeeTable from "@/app/employees/components/EmployeeTable";
import WalletConnectButton from "@/components/ConnectWalletButton";

function EmployeesContent() {
  const searchParams = useSearchParams();
  const organizationId = searchParams.get("org");

  const { address } = useAccount();
  const {
    organizations,
    activeOrganization,
    setActiveOrganization,
    fetchOrganizations,
    isLoading,
  } = useOrganizationStore();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 1. Sync the Active Organization based on the Query parameter
  useEffect(() => {
    if (address && organizationId) {
      // If store is empty (reload), fetch first
      if (organizations.length === 0) {
        fetchOrganizations(address);
      }

      const targetOrganization = organizations.find(
        (c) => c.id === organizationId
      );

      // Update store if mismatch
      if (
        targetOrganization &&
        targetOrganization.id !== activeOrganization?.id
      ) {
        setActiveOrganization(targetOrganization);
      }
    }
  }, [
    organizationId,
    address,
    organizations,
    activeOrganization,
    fetchOrganizations,
    setActiveOrganization,
  ]);

  // Gatekeeper: Wallet Check
  if (!address) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl border border-gray-200 max-w-md w-full shadow-sm"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
          <p className="text-gray-500 mb-8">
            Connect your wallet to manage this organization's roster.
          </p>
          <div className="flex justify-center">
            <WalletConnectButton />
          </div>
        </motion.div>
      </div>
    );
  }

  // Not Found State (if ID provided but doesn't exist in user's organizations)
  if (
    isClient &&
    !isLoading &&
    organizations.length > 0 &&
    organizationId && // Only check if an ID was actually requested
    activeOrganization?.id !== organizationId
  ) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
          <Users className="text-gray-400" />
        </div>
        <h2 className="text-xl font-bold mb-2">Organization Not Found</h2>
        <p className="text-gray-500 mb-6">
          You don't have access to this roster.
        </p>
        <Link
          href="/dashboard"
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // Fallback if no org selected (optional, depends on if you want to allow global view)
  if (!organizationId && !activeOrganization) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <p className="text-gray-500 mb-4">
          Please select an organization to view employees.
        </p>
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 px-6 md:px-[120px] max-w-7xl mx-auto">
      {/* --- HEADER --- */}
      <div className="mb-10">
        <Link
          href={`/organizations/${organizationId}`}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-6 group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Org Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-center gap-4 border-b border-gray-100 pb-8">
          <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg shadow-gray-200">
            <Building2 size={28} />
          </div>
          <div>
            <h1 className="text-3xl capitalize font-bold tracking-tight text-gray-900">
              {activeOrganization ? activeOrganization.name : "Loading..."}
            </h1>
            <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
              <span>Employee Roster Management</span>
            </p>
          </div>
        </div>
      </div>

      {/* --- INPUT METHODS GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 items-stretch">
        {/* 1. Manual Entry */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="p-2 bg-gray-50 rounded-lg text-black">
              <UserPlus size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Manual Entry</h3>
          </div>
          {/* Form auto-reads activeOrg from store */}
          <AddEmployeeForm />
        </motion.div>

        {/* 2. Magic AI Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="h-full"
        >
          <MagicInput />
        </motion.div>

        {/* 3. Bulk Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="p-2 bg-gray-50 rounded-lg text-black">
              <Upload size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Bulk CSV</h3>
          </div>
          <div className="flex-1">
            <CSVUploader />
          </div>
        </motion.div>
      </div>

      {/* --- ROSTER TABLE --- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="pt-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Users size={20} className="text-gray-400" />
          <h3 className="text-xl font-bold text-gray-900">Current Roster</h3>
        </div>
        {/* Table auto-reads activeOrg from store */}
        <EmployeeTable />
      </motion.div>
    </div>
  );
}

export default function OrganizationEmployeesPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <EmployeesContent />
    </Suspense>
  );
}
