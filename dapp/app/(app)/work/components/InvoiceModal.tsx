"use client";
import React, { useState } from "react";
import { X, Send, Link as LinkIcon, Check } from "lucide-react";
import toast from "react-hot-toast";

type InvoiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userAddress?: string;
  tongoAddress?: string;
};

export default function InvoiceModal({
  isOpen,
  onClose,
  userAddress,
  tongoAddress,
}: InvoiceModalProps) {
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!client || !amount) {
        toast.error("Please fill in client and amount");
        return;
    }
    
    // Simulate link generation
    const mockLink = `https://ghostpay.xyz/pay/${tongoAddress?.slice(0, 10) || "user"}?amount=${amount}&ref=${Date.now()}`;
    setGeneratedLink(mockLink);
    toast.success("Invoice created!");
  };

  const copyLink = () => {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied to clipboard");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Send size={24} className="text-black" />
            Request Payment
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {!generatedLink ? (
             <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                        Bill To (Client Name)
                    </label>
                    <input 
                        type="text"
                        value={client}
                        onChange={(e) => setClient(e.target.value)}
                        placeholder="e.g. Acme Corp"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-black/5"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                        Amount (STRK)
                    </label>
                    <input 
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-mono text-lg font-bold outline-none focus:ring-2 focus:ring-black/5"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                        Memo / Description
                    </label>
                    <textarea 
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        placeholder="e.g. Design Services - Jan Retainer"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-black/5 resize-none h-24"
                    />
                </div>

                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    Funds will be received directly into your <strong>Private Ghost Vault</strong>. The client will not see your main wallet address.
                </div>

                <button
                    onClick={handleCreate}
                    className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                    Create Payment Link
                </button>
             </div>
        ) : (
             <div className="space-y-6 text-center py-4">
                 <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Check size={32} />
                 </div>
                 <h3 className="text-xl font-bold">Invoice Ready!</h3>
                 <p className="text-gray-500 text-sm">
                    Share this link with {client} to get paid privately.
                 </p>

                 <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
                     <div className="flex-1 truncate text-xs font-mono text-gray-600 px-2">
                         {generatedLink}
                     </div>
                     <button 
                        onClick={copyLink}
                        className={`p-2 rounded-lg transition-colors ${copied ? "bg-green-100 text-green-700" : "bg-white border border-gray-200 hover:bg-gray-100"}`}
                     >
                         {copied ? <Check size={16} /> : <LinkIcon size={16} />}
                     </button>
                 </div>

                 <button
                    onClick={() => {
                        setGeneratedLink("");
                        onClose();
                    }}
                    className="text-gray-500 font-bold text-sm hover:text-black"
                 >
                    Done
                 </button>
             </div>
        )}
      </div>
    </div>
  );
}
