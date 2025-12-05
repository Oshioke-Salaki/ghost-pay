"use client";
import React, { useState } from "react";
import { Sparkles, Wand2, Loader2 } from "lucide-react";
import { usePayrollStore } from "@/store/payrollStore";
import { useAccount } from "@starknet-react/core";

export default function MagicInput() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { address: employerAddress } = useAccount();
  const addBulk = usePayrollStore((s) => s.addEmployees);

  const handleMagicParse = async () => {
    if (!text.trim()) return;
    setLoading(true);

    try {
      const response = await fetch("/api/parse-roster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (data.employees && Array.isArray(data.employees)) {
        const hydrated = data.employees.map((e: any) => ({
          ...e,
          first_name: e.first_name || "Unknown",
          last_name: e.last_name || "",
          address: e.address || "",
          salary: Number(e.salary) || 0,
          employer_address: employerAddress,
        }));

        addBulk(hydrated, employerAddress as string);
        setText("");
      }
    } catch (error) {
      console.error("Magic parse failed", error);
      alert("The spirits were confused. Please check the format.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group h-full">
      <div className="absolute -inset-0.5 bg-linear-to-r from-pink-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

      <div className="relative h-full bg-white rounded-2xl p-6 border border-purple-100 shadow-sm flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
            <Wand2 size={20} />
          </div>
          <h3 className="font-bold text-gray-900">Magic Import</h3>
          <span className="text-xs font-bold bg-linear-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
            AI POWERED
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Paste an email, Slack message, or rough notes here. We'll extract the
          roster automatically.
        </p>

        <textarea
          className="w-full flex-1 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none text-sm font-mono placeholder:text-gray-400 transition-all mb-4"
          placeholder={`"Hey, pay Alice 500 STRK (0x0123...) and Bob 200 (0x0456...). Oh, and give Charlie 1k (0x0789...)"`}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={handleMagicParse}
          disabled={loading || !text}
          className="w-full py-3 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Parsing...
            </>
          ) : (
            <>
              <Sparkles size={18} className="group-hover/btn:animate-pulse" />
              Generate Roster
            </>
          )}
        </button>
      </div>
    </div>
  );
}
