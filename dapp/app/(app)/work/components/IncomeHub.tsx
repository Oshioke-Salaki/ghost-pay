"use client";
import React, { useState } from "react";
import { 
  Building2, 
  Briefcase, 
  ShieldCheck, 
  FileCheck, 
  Send, 
  Clock,
  MoreHorizontal
} from "lucide-react";
import { useAccount } from "@starknet-react/core";
import { useTongoAccount } from "@/hooks/useTongoAccount";
import ProofGenerationModal from "./ProofGenerationModal";
import InvoiceModal from "./InvoiceModal";

export default function IncomeHub() {
  const { address } = useAccount();
  const { tongoAccounts } = useTongoAccount();
  const tongoAccount = tongoAccounts?.["STRK"];
  
  const [showProofModal, setShowProofModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Mock Data for "Organizations" (Employment History)
  // In a real app, this would come from a "Roster" table query where user is listed.
  const organizations = [
    { id: 1, name: "Starkware Industries", role: "Core Contributor", joined: "Nov 2024", status: "Active" },
    { id: 2, name: "Consensys Mesh", role: "Design Lead", joined: "Jun 2024", status: "Active" },
    { id: 3, name: "Argent Labs", role: "Consultant", joined: "Jan 2024", status: "Past" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
        <ProofGenerationModal 
            isOpen={showProofModal} 
            onClose={() => setShowProofModal(false)} 
            userAddress={address}
        />
        <InvoiceModal
            isOpen={showInvoiceModal}
            onClose={() => setShowInvoiceModal(false)}
            userAddress={address}
            tongoAddress={tongoAccount?.tongoAddress() || address} // Fallback to public if no tongo
        />

        {/* 1. Verified Status Banner */}
        <div className="bg-gradient-to-r from-gray-900 to-black text-white rounded-3xl p-8 relative overflow-hidden shadow-xl">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                 <ShieldCheck size={200} />
             </div>
             
             <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div>
                     <div className="flex items-center gap-2 text-green-400 font-bold uppercase tracking-wider text-xs mb-2">
                         <ShieldCheck size={14} />
                         On-Chain Verified
                     </div>
                     <h2 className="text-3xl font-bold mb-1">Professional Profile</h2>
                     <p className="text-gray-400 max-w-lg">
                         Your employment history and income are cryptographic proofs. 
                         Share them securely without revealing private details.
                     </p>
                 </div>
                 
                 <div className="flex gap-3">
                     <button 
                        onClick={() => setShowInvoiceModal(true)}
                        className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center gap-2"
                     >
                         <Send size={18} />
                         Invoice
                     </button>
                     <button 
                        onClick={() => setShowProofModal(true)}
                        className="bg-gray-800 text-white border border-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-700 transition-colors flex items-center gap-2"
                     >
                         <FileCheck size={18} />
                         Proof of Income
                     </button>
                 </div>
             </div>
        </div>

        {/* 2. Employment History */}
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
                <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                    <Briefcase size={20} />
                    Work History
                </h3>
                
                {organizations.map((org) => (
                    <div key={org.id} className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-between hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-bold text-xl uppercase">
                                {org.name.slice(0, 1)}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {org.name}
                                </h4>
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                    <span>{org.role}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                    <span>Since {org.joined}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                org.status === "Active" 
                                    ? "bg-green-100 text-green-700" 
                                    : "bg-gray-100 text-gray-500"
                            }`}>
                                {org.status}
                            </span>
                            <button className="p-2 text-gray-300 hover:text-black transition-colors rounded-full hover:bg-gray-50">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                    </div>
                ))}

                <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold hover:border-gray-300 hover:text-gray-600 transition-all flex items-center justify-center gap-2">
                    <Building2 size={20} />
                    Join New Organization
                </button>
            </div>

            {/* 3. Stats / Insights */}
            <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-3xl p-6">
                     <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                         <Clock size={16} />
                         Pending Requests
                     </h4>
                     <div className="space-y-4">
                         <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                             <div className="flex justify-between items-start mb-2">
                                 <div className="font-bold text-sm">Design Retainer</div>
                                 <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Unpaid</span>
                             </div>
                             <div className="text-2xl font-mono font-bold text-gray-900">
                                 1,500 STRK
                             </div>
                             <div className="text-xs text-gray-400 mt-2">
                                 Sent 2 days ago to Acme Corp
                             </div>
                         </div>
                     </div>
                </div>
            </div>
        </div>
    </div>
  );
}
