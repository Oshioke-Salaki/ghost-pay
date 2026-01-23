"use client";
import { useAccount } from "@starknet-react/core";
import { shortenAddress } from "@/lib/utils";
import { User, ChevronDown } from "lucide-react";
import { useState } from "react";
import WalletProfileModal from "./WalletProfileModal";

export default function UserBar() {
  const { address } = useAccount();
  const [showProfile, setShowProfile] = useState(false);

  if (!address) return null;

  return (
    <>
      <WalletProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
      
      <button 
        onClick={() => setShowProfile(true)}
        className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full shadow-sm transition-all border bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-md group"
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center border bg-linear-to-tr from-gray-100 to-gray-200 border-gray-100 group-hover:scale-105 transition-transform`}
        >
          <User size={16} className="text-gray-600" />
        </div>

        <div className="flex flex-col items-start px-1">
            <span className="font-mono text-sm font-bold text-gray-900 leading-tight">
             {shortenAddress(address)}
            </span>
        </div>
        
        <ChevronDown size={14} className="text-gray-400 group-hover:text-black transition-colors ml-1" />
      </button>
    </>
  );
}
