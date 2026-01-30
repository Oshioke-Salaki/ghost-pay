"use client";
import React, { useRef, useState } from "react";
import { parseCSV } from "@/lib/csv";
import { usePayrollStore } from "@/store/payrollStore";
import { Upload, FileText, Loader2 } from "lucide-react";
import { useAccount } from "@starknet-react/core";
import toast from "react-hot-toast";

export default function CSVUploader({
  organizationId,
}: {
  organizationId: string;
}) {
  const { address: employer_address } = useAccount();
  const addBulk = usePayrollStore((s) => s.addEmployees);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const text = await file.text();
      const parsed = parseCSV(text);

      if (parsed.length === 0) {
        toast.error(
          "No valid employees found. Please check the CSV format (First, Last, Address, Amount)",
        );
        e.target.value = "";
        setIsLoading(false);
        return;
      }

      await addBulk(parsed, organizationId, employer_address as string);
      toast.success(`Successfully imported ${parsed.length} employees!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to import employees. Please try again.");
    } finally {
      setIsLoading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div
        className={`
          flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer h-full min-h-[250px] relative
          ${
            isHovering
              ? "border-black bg-gray-50"
              : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
          }
        `}
        onDragOver={(e) => {
          if (isLoading) return;
          e.preventDefault();
          setIsHovering(true);
        }}
        onDragLeave={() => setIsHovering(false)}
        onDrop={(e) => {
          if (isLoading) return;
          e.preventDefault();
          setIsHovering(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            fileInputRef.current!.files = e.dataTransfer.files;
            const event = { target: { files: e.dataTransfer.files } } as any;
            onFile(event);
          }
        }}
        onClick={() => !isLoading && fileInputRef.current?.click()}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center animate-in fade-in">
            <Loader2 className="w-10 h-10 text-black animate-spin mb-4" />
            <p className="font-semibold text-gray-900">Processing CSV...</p>
            <p className="text-sm text-gray-500 mt-1">
              Adding employees to roster
            </p>
          </div>
        ) : (
          <>
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
              disabled={isLoading}
            />

            <div className="bg-gray-50 border border-gray-200 rounded px-4 py-3 text-xs text-left w-full max-w-[280px]">
              <p className="font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <FileText size={12} /> Required Format:
              </p>
              <code className="block bg-white border border-gray-100 p-1.5 rounded text-gray-500 font-mono">
                First, Last, Address, Salary (USD), Position (Optional)
              </code>
              <p className="mt-2 text-gray-400 italic">
                Example: Alice, Stark, 0x123..., 5000, Engineer
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
