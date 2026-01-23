"use client";
import React, { useState } from "react";
import { useAccount, useDisconnect, useBalance } from "@starknet-react/core";
import { Copy, Check, LogOut, Wallet, X, ExternalLink } from "lucide-react";
import Image from "next/image";
import { shortenAddress } from "@/lib/utils";
import { STRK_ADDR, ETH_ADDR } from "@/lib/data";

interface WalletProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletProfileModal({
  isOpen,
  onClose,
}: WalletProfileModalProps) {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);

  const { data: ethBalance } = useBalance({
    address,
    token: ETH_ADDR as `0x${string}`,
    watch: true,
  });

  const { data: strkBalance } = useBalance({
    address,
    token: STRK_ADDR as `0x${string}`,
    watch: true,
  });

  if (!isOpen || !address) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDisconnect = () => {
    disconnect();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="font-bold text-gray-900">Wallet Profile</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-black transition-colors rounded-full p-1 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Address Card */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
               <span className="text-xs font-bold text-gray-500 uppercase">Connected Address</span>
               <a 
                href={`https://starkscan.co/contract/${address}`}
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
               >
                 View Explorer <ExternalLink size={10} />
               </a>
            </div>
            
            <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
              <span className="font-mono text-sm font-medium text-gray-700 truncate mr-2">
                {shortenAddress(address)}
              </span>
              <button 
                onClick={handleCopy}
                className="text-gray-400 hover:text-black transition-colors"
                title="Copy Address"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* Balances */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Wallet size={16} className="text-gray-400" /> Assets
            </h4>
            <div className="space-y-3">
              {/* ETH */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                           <img
                             src="https://imagedelivery.net/0xPAQaDtnQhBs8IzYRIlNg/e07829b7-0382-4e03-7ecd-a478c5aa9f00/logo"
                             alt="ETH"
                             width={32}
                             height={32}
                           />
                        </div>
                        <span className="font-medium text-sm">Ethereum</span>
                    </div>
                    <div className="text-right">
                        <div className="font-bold font-mono">
                            {ethBalance ? parseFloat(ethBalance.formatted).toFixed(4) : "0.0000"}
                        </div>
                        <div className="text-xs text-gray-500">ETH</div>
                    </div>
                </div>

                {/* STRK */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center overflow-hidden p-1.5">
                            <img
                             src="/starknetlogo.svg"
                             alt="STRK"
                             width={32}
                             height={32}
                           />
                        </div>
                        <span className="font-medium text-sm">Starknet Token</span>
                    </div>
                    <div className="text-right">
                        <div className="font-bold font-mono">
                            {strkBalance ? parseFloat(strkBalance.formatted).toFixed(2) : "0.00"}
                        </div>
                        <div className="text-xs text-gray-500">STRK</div>
                    </div>
                </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <button
                onClick={handleDisconnect}
                className="w-full py-3 rounded-xl border border-red-100 bg-red-50 text-red-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
            >
                <LogOut size={16} /> Disconnect Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
