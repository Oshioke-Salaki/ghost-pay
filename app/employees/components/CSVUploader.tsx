"use client";
import React, { useRef } from "react";
import { parseCSV } from "@/lib/csv";
import { usePayrollStore } from "@/store/payrollStore";
import { Upload } from "lucide-react";

export default function CSVUploader() {
  const addBulk = usePayrollStore((s) => s.addEmployees);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parsed = parseCSV(text); // returns [{address,amount}, ...]
    addBulk(parsed);
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex justify-center">
        <Upload size={80} />
      </div>
      <label className="block text-center font-medium text-lg">
        Upload CSV file
      </label>
      <h6 className="text-xs text-center">(address, amount)</h6>
      <input
        type="file"
        accept="text/csv"
        onChange={onFile}
        className="mt-2 hidden"
        ref={fileInputRef}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="rounded-lg border cursor-pointer mx-auto border-solid px-10 py-2 mt-4 text-base font-medium text-black"
      >
        Browse File
      </button>
    </div>
  );
}
