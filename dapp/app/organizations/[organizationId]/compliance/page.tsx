"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAccount } from "@starknet-react/core";
import {
  ShieldCheck,
  ArrowLeft,
  Plus,
  Key,
  Eye,
  Copy,
  Check,
  Calendar,
  Lock,
  FileText,
} from "lucide-react";
import WalletConnectButton from "@/components/ConnectWalletButton";
import { useOrganizationStore } from "@/store/organizationStore";

// Mock Data for generated keys
interface AuditKey {
  id: string;
  label: string;
  generated_at: string;
  expires_at: string;
  key_string: string;
}

export default function CompliancePage() {
  const { companyId } = useParams();
  const { address } = useAccount();
  const { activeOrganization, fetchOrganizations, organizations } =
    useOrganizationStore();

  const [keys, setKeys] = useState<AuditKey[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Sync Company
  useEffect(() => {
    if (address && organizations.length === 0) {
      fetchOrganizations(address);
    }
  }, [address, organizations, fetchOrganizations]);

  const handleGenerateKey = async () => {
    setIsGenerating(true);

    // 1. Simulate Key Generation (In production, this signs a message)
    // const signature = await account.signMessage(...)

    setTimeout(() => {
      const newKey: AuditKey = {
        id: crypto.randomUUID(),
        label: `Q4 2024 Payroll Audit`, // Could be an input
        generated_at: new Date().toISOString(),
        expires_at: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(), // 7 days
        key_string:
          "view_" +
          Math.random().toString(36).slice(2) +
          Math.random().toString(36).slice(2),
      };

      setKeys([newKey, ...keys]);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Key copied to clipboard");
  };

  if (!address) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 max-w-md w-full shadow-sm">
          <ShieldCheck size={32} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Compliance Portal</h2>
          <p className="text-gray-500 mb-6">
            Connect wallet to manage audit keys.
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl text-green-700">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Compliance Keys
              </h1>
              <p className="text-gray-500 text-sm">
                Generate "View Only" keys for auditors.{" "}
                {activeOrganization?.name}
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerateKey}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95"
          >
            {isGenerating ? (
              "Generating..."
            ) : (
              <>
                <Plus size={18} /> New View Key
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
        <FileText className="text-blue-600 mt-1" size={20} />
        <div>
          <h4 className="font-bold text-blue-900 text-sm">
            Selective Disclosure
          </h4>
          <p className="text-blue-700 text-xs mt-1">
            View Keys grant <strong>read-only</strong> access to your decrypted
            transaction history for a limited time. They cannot move funds or
            sign transactions. Share these securely with your accountant or
            auditor.
          </p>
        </div>
      </div>

      {/* Key List */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
        {keys.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
              <Key size={32} />
            </div>
            <h3 className="font-bold text-gray-900">No Active Keys</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-sm">
              You haven't generated any view keys yet. Create one to share your
              payroll history with an auditor.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            <div className="bg-gray-50 px-6 py-3 grid grid-cols-12 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <div className="col-span-4">Label</div>
              <div className="col-span-3">Created</div>
              <div className="col-span-3">Expires</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            {keys.map((key) => (
              <div
                key={key.id}
                className="px-6 py-4 grid grid-cols-12 items-center hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-4 font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  {key.label}
                </div>
                <div className="col-span-3 text-sm text-gray-500 flex items-center gap-2">
                  <Calendar size={14} />
                  {new Date(key.generated_at).toLocaleDateString()}
                </div>
                <div className="col-span-3 text-sm text-gray-500 font-mono">
                  {new Date(key.expires_at).toLocaleDateString()}
                </div>
                <div className="col-span-2 flex justify-end gap-2">
                  <button
                    onClick={() =>
                      handleCopy(
                        `https://ghostpay.finance/audit/${key.key_string}`
                      )
                    }
                    className="p-2 border border-gray-200 rounded-lg hover:bg-white hover:border-gray-300 text-gray-500 transition-colors"
                    title="Copy Link"
                  >
                    <Copy size={16} />
                  </button>
                  <button className="p-2 border border-gray-200 rounded-lg hover:bg-white hover:border-gray-300 text-gray-500 transition-colors">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
