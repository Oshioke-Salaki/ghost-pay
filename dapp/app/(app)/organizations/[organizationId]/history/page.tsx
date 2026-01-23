"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAccount } from "@starknet-react/core";
import {
  ArrowLeft,
  History,
  FileText,
  Download,
  Search,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { supabase } from "@/utils/superbase/server";
import WalletConnectButton from "@/components/ConnectWalletButton";
import { useOrganizationStore } from "@/store/organizationStore";
import { useUIStore } from "@/store/uiStore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Type for a stored payroll batch
interface PayrollRun {
  id: string;
  created_at: string;
  total_amount: number;
  currency: string;
  recipient_count: number;
  tx_hash: string;
  status: "completed" | "failed" | "pending";
  details: any[]; // Stores the JSON roster snapshot
}

export default function HistoryPage() {
  const { organizationId } = useParams();
  const { address } = useAccount();
  const { activeOrganization, fetchOrganizations, organizations } =
    useOrganizationStore();
  const hideAmounts = useUIStore((s) => s.hideAmounts);

  const [history, setHistory] = useState<PayrollRun[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Sync Org
  useEffect(() => {
    if (address && organizations.length === 0) {
      fetchOrganizations(address);
    }
  }, [address, organizations, fetchOrganizations]);

  // Fetch History
  useEffect(() => {
    const fetchHistory = async () => {
      if (!organizationId) return;
      setIsLoading(true);

      try {
        // Fetch runs linked to this org
        const { data, error } = await supabase
          .from("payroll_runs") // Ensure this table exists!
          .select("*")
          .eq("organization_id", organizationId)
          .order("created_at", { ascending: false });

        if (data) {
          // Cast data to PayrollRun type
          setHistory(data as any[]);
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [organizationId]);

  // PDF Generation Re-used Logic
  const handleDownloadReceipt = (run: PayrollRun) => {
    const doc = new jsPDF();

    // Header
    doc.setFont("courier", "bold");
    doc.setFontSize(22);
    doc.text("GHOSTPAY // TRANSACTION RECORD", 14, 20);

    doc.setFontSize(10);
    doc.setFont("courier", "normal");
    doc.text(`REFERENCE ID: ${run.id.split("-")[0].toUpperCase()}`, 14, 28);
    doc.text(
      `DATE:         ${new Date(run.created_at).toLocaleString()}`,
      14,
      33
    );
    doc.text(`TX HASH:      ${run.tx_hash || "N/A"}`, 14, 38);
    doc.text(
      `ORGANIZATION:      ${activeOrganization?.name || "Unknown"}`,
      14,
      43
    );

    doc.setLineWidth(0.5);
    doc.line(14, 48, 196, 48);

    // Table
    // Assuming 'details' contains { name, address, amount }
    const rows = run.details
      ? run.details.map((e: any) => [
          e.name || `${e.first_name} ${e.last_name}`,
          e.address,
          `${e.amount || e.salary} ${run.currency || "STRK"}`,
          "CONFIRMED",
        ])
      : [];

    autoTable(doc, {
      startY: 55,
      head: [["RECIPIENT", "WALLET ADDRESS", "AMOUNT", "STATUS"]],
      body: rows,
      theme: "plain",
      styles: {
        font: "courier",
        fontSize: 9,
        cellPadding: 3,
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont("courier", "bold");
    doc.text(
      `TOTAL VOLUME: ${run.total_amount.toFixed(2)} ${run.currency || "STRK"}`,
      14,
      finalY
    );

    doc.save(`payroll_receipt_${run.created_at.split("T")[0]}.pdf`);
  };

  const filteredHistory = history.filter(
    (run) =>
      run.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(run.created_at).toLocaleDateString().includes(searchTerm)
  );

  if (!address) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 max-w-md w-full shadow-sm">
          <History size={32} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Login Required</h2>
          <p className="text-gray-500 mb-6">
            Connect your wallet to view transaction history.
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
      {/* Header */}
      <div className="mb-10">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-black flex items-center gap-1 mb-4 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-xl text-gray-900">
              <History size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Payroll History
              </h1>
              <p className="text-gray-500 text-sm">
                Archive of all executed batches for {activeOrganization?.name}.
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by ID or Date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors w-full md:w-64"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2">
            <Loader2 size={32} className="animate-spin" />
            <p className="text-sm">Retrieving records...</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4 py-20">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
              <FileText size={32} />
            </div>
            <div className="text-center">
              <h3 className="text-gray-900 font-bold">No Records Found</h3>
              <p className="text-sm mt-1">
                You haven't run any payroll batches yet.
              </p>
            </div>
            <Link
              href={`/${organizationId}/distribute`}
              className="px-6 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-all"
            >
              Run Payroll
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Reference ID</th>
                  <th className="px-6 py-4">Recipients</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredHistory.map((run, i) => (
                  <motion.tr
                    key={run.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-900 flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      {new Date(run.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {run.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {run.recipient_count} Employees
                    </td>
                    <td
                      className={`px-6 py-4 font-mono font-bold transition-all duration-300 ${
                        hideAmounts ? "blur-sm select-none" : ""
                      }`}
                    >
                      {run.total_amount.toFixed(2)} {run.currency || "STRK"}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={run.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDownloadReceipt(run)}
                        className="text-gray-400 hover:text-black p-2 hover:bg-white border border-transparent hover:border-gray-200 rounded-lg transition-all"
                        title="Download Receipt"
                      >
                        <Download size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
        <CheckCircle2 size={12} /> Completed
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
        <XCircle size={12} /> Failed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
      <Clock size={12} /> Pending
    </span>
  );
}
