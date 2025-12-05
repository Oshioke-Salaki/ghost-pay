import React from "react";
import Link from "next/link";
import { CheckCircle, Home, FileText, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Employee } from "@/types/employee";

interface SuccessSummaryProps {
  employees: Employee[];
  totalAmount: number;
}

const SuccessSummary: React.FC<SuccessSummaryProps> = ({
  employees,
  totalAmount,
}) => {
  const totalEmployees = employees.length;

  // 2. The PDF Generation Logic
  const generateReceipt = () => {
    const doc = new jsPDF();

    // -- STYLING SETUP --
    // We use "Courier" font to give it that "Secret Document" feel
    doc.setFont("courier", "bold");

    // -- HEADER --
    doc.setFontSize(22);
    doc.text("GHOSTPAY // CONFIDENTIAL", 14, 20);

    doc.setFontSize(10);
    doc.setFont("courier", "normal");
    doc.text(
      `REFERENCE ID: ${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      14,
      28
    );
    doc.text(`TIMESTAMP:    ${new Date().toLocaleString()}`, 14, 33);
    doc.text(`PROTOCOL:     TYPHOON-ZK-MIXER`, 14, 38);

    // -- SEPARATOR LINE --
    doc.setLineWidth(0.5);
    doc.line(14, 42, 196, 42);

    // -- THE DATA TABLE --
    // We format the data for the table plugin
    const tableBody = employees.map((e) => [
      `${e.first_name} ${e.last_name}`,
      e.address, // Full address usually fits, or slice it if needed
      `${e.salary.toFixed(2)} STRK`,
      "OBFUSCATED", // The "Ghost" status
    ]);

    autoTable(doc, {
      startY: 48,
      head: [["RECIPIENT IDENTITY", "DESTINATION WALLET", "AMOUNT", "STATUS"]],
      body: tableBody,
      theme: "plain", // Minimalist theme
      styles: {
        font: "courier",
        fontSize: 9,
        cellPadding: 3,
        lineColor: [0, 0, 0], // Black lines
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [0, 0, 0], // Black Header Background
        textColor: [255, 255, 255], // White Header Text
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 80 }, // Address needs more space
        2: { cellWidth: 30, halign: "right" },
        3: { cellWidth: 30, halign: "center" },
      },
    });

    // -- FOOTER SUMMARY --
    // Get the Y position where the table ended
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.setFont("courier", "bold");
    doc.text(`TOTAL VOLUME: ${totalAmount.toFixed(2)} STRK`, 14, finalY);

    // Bottom Disclaimer
    doc.setFontSize(8);
    doc.setFont("courier", "normal");
    const pageHeight = doc.internal.pageSize.height;
    doc.text(
      "CERTIFIED: This document verifies that funds were successfully distributed via the Starknet network.",
      14,
      pageHeight - 10
    );

    // -- DOWNLOAD --
    doc.save(`ghostpay_receipt_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center animate-in zoom-in-95">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={40} className="text-green-600" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Distribution Complete
      </h2>
      <p className="text-gray-500 mb-8 max-w-sm mx-auto">
        All transactions have been successfully obfuscated and delivered.
      </p>

      {/* Receipt Summary Card */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
          <span className="text-gray-500 text-sm">Total Recipients</span>
          <span className="font-bold">{totalEmployees}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">Total Distributed</span>
          <span className="font-mono font-bold text-lg">
            {totalAmount.toFixed(2)} STRK
          </span>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          <Home size={18} /> Return Home
        </Link>

        <button
          onClick={generateReceipt}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Download size={18} /> Export PDF
        </button>
      </div>
    </div>
  );
};

export default SuccessSummary;
