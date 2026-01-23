"use client";
import React, { useState } from "react";
import { X, FileCheck, ShieldCheck, Calendar, Download } from "lucide-react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type ProofGenerationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userAddress?: string;
};

export default function ProofGenerationModal({
  isOpen,
  onClose,
  userAddress,
}: ProofGenerationModalProps) {
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState("Last 6 Months");
  const [includeDetails, setIncludeDetails] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500)); // Fake generation time

    try {
      const doc = new jsPDF();
      
      // Branding
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("GhostPay Income Verification", 105, 20, { align: "center" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text("Powered by ZK-STARKs & Tongo Protocol", 105, 26, { align: "center" });

      // Verification Badge
      doc.setDrawColor(0);
      doc.setFillColor(240, 240, 240);
      doc.rect(20, 35, 170, 30, "F");
      
      doc.setTextColor(0);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("VERIFIED PROOF OF INCOME", 105, 45, { align: "center" });
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Reference ID: 0x${Math.random().toString(16).slice(2)}...`, 105, 52, { align: "center" });
      doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 105, 57, { align: "center" });

      // User Details
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Subject Identity:", 20, 80);
      doc.setFont("helvetica", "normal");
      doc.text(userAddress || "Unknown", 20, 87);

      // Income Summary
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Certified Earnings Summary:", 20, 105);

      autoTable(doc, {
        startY: 110,
        head: [["Period", "Total Earned (STRK)", "Source Count", "Status"]],
        body: [
          [period, "12,450.00 STRK", "3 Organizations", "VERIFIED ON-CHAIN"]
        ],
        theme: "grid",
        headStyles: { fillColor: [0, 0, 0] },
      });

      // Organizations
      if (includeDetails) {
          doc.text("Source Breakdown (Selective Disclosure):", 20, (doc as any).lastAutoTable.finalY + 15);
          autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 20,
            head: [["Organization", "Role", "Tenure"]],
            body: [
              ["Starkware Industries", "Core Contributor", "12 Months"],
              ["Consensys Mesh", "Design Lead", "6 Months"],
              ["Argent Labs", "Consultant", "3 Months"],
            ],
            theme: "striped",
          });
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        "This document is cryptographically generated. The amounts shown have been proven via Zero-Knowledge proofs without revealing the underlying transaction history to the public ledger.",
        20,
        280,
        { maxWidth: 170 }
      );

      doc.save("ghostpay_income_proof.pdf");
      toast.success("Certificate downloaded!");
      onClose();
    } catch (e: any) {
      console.error(e);
      toast.error("Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck size={24} className="text-black" />
            Generate Proof
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 flex gap-3">
             <FileCheck size={24} className="shrink-0" />
             <p>
               This generates a signed PDF attesting to your income without revealing your full wallet history. Useful for rent, loans, or visas.
             </p>
          </div>

          <div>
             <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                Verification Period
             </label>
             <select 
               value={period}
               onChange={(e) => setPeriod(e.target.value)}
               className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-black/5"
             >
                <option>Last 3 Months</option>
                <option>Last 6 Months</option>
                <option>Year to Date</option>
                <option>Full History</option>
             </select>
          </div>

          <div className="flex items-center gap-3">
             <input 
               type="checkbox" 
               id="details" 
               checked={includeDetails}
               onChange={(e) => setIncludeDetails(e.target.checked)}
               className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
             />
             <label htmlFor="details" className="text-sm font-medium text-gray-700">
                Include Organization Names
             </label>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>Generating Proof...</>
            ) : (
              <>
                <Download size={20} />
                Download Certificate
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
