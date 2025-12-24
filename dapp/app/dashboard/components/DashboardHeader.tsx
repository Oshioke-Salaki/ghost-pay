import { Briefcase, Wallet, Zap } from "lucide-react";
import Link from "next/link";
import React from "react";

function DashboardHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your organization's finances and payroll securely.
        </p>
      </div>
      <div className="flex gap-3 text-sm">
        <Link
          href="/instant-pay"
          className="px-5 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200 flex items-center gap-2"
        >
          <Zap size={16} fill="currentColor" /> Instant Pay
        </Link>

        <Link
          href="/finance"
          className="px-5 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2"
        >
          <Wallet size={16} /> Treasury
        </Link>

        <Link
          href="/organizations"
          className="px-5 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg flex items-center gap-2"
        >
          <Briefcase size={16} /> Manage Organizations
        </Link>
      </div>
    </div>
  );
}

export default DashboardHeader;
