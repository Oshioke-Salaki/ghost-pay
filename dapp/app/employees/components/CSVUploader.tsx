"use client";
import React, { useRef, useState } from "react";
import { parseCSV } from "@/lib/csv";
import { usePayrollStore } from "@/store/payrollStore";
import { Upload, FileText } from "lucide-react";
import { useAccount } from "@starknet-react/core";

export default function CSVUploader() {
  const { address: employer_address } = useAccount();
  const addBulk = usePayrollStore((s) => s.addEmployees);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const parsed = parseCSV(text);

    addBulk(parsed, employer_address as string);

    e.target.value = "";
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div
        className={`
          flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer h-full min-h-[250px]
          ${
            isHovering
              ? "border-black bg-gray-50"
              : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
          }
        `}
        onDragOver={(e) => {
          e.preventDefault();
          setIsHovering(true);
        }}
        onDragLeave={() => setIsHovering(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsHovering(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            fileInputRef.current!.files = e.dataTransfer.files;
            const event = { target: { files: e.dataTransfer.files } } as any;
            onFile(event);
          }
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Upload size={32} className="text-gray-500" />
        </div>

        <h4 className="font-semibold text-lg text-gray-900">
          Click to upload CSV
        </h4>
        <p className="text-gray-500 text-sm mt-1 mb-6 text-center max-w-[200px]">
          Drag & drop or browse from your computer
        </p>

        <input
          type="file"
          accept=".csv"
          onChange={onFile}
          className="hidden"
          ref={fileInputRef}
        />

        <div className="bg-gray-50 border border-gray-200 rounded px-4 py-3 text-xs text-left w-full max-w-[280px]">
          <p className="font-semibold text-gray-700 mb-1 flex items-center gap-1">
            <FileText size={12} /> Required Format:
          </p>
          <code className="block bg-white border border-gray-100 p-1.5 rounded text-gray-500 font-mono">
            First, Last, Address, Amount
          </code>
          <p className="mt-2 text-gray-400 italic">
            Example: Alice, Stark, 0x123..., 50
          </p>
        </div>
      </div>
    </div>
  );
}
