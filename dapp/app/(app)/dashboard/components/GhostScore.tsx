"use client";
import React, { useMemo, useState } from "react";
import { Shield, ArrowUpRight } from "lucide-react";
import { useTongoAccount } from "@/hooks/useTongoAccount";
import { usePrivateBalance } from "@/hooks/usePrivateBalance";
import { usePortfolio } from "@/hooks/usePortfolio";
import ShieldModal from "@/components/finance/ShieldModal";

export default function GhostScore() {
  const { tongoAccounts, conversionRates } = useTongoAccount();
  const { privateBalances, refetchPrivateBalances } = usePrivateBalance({
    tongoAccounts,
    conversionRates,
  });
  
  const [showShieldModal, setShowShieldModal] = useState(false);
  
  // -- Unified Portfolio Hook --
  const { privacyRatio, totalPublicUsd, totalPrivateUsd } = usePortfolio();

  // -- UI States --
  const getScoreColor = (r: number) => {
      if (r >= 80) return "text-purple-400";
      if (r >= 50) return "text-green-400";
      if (r >= 20) return "text-yellow-400";
      return "text-red-400";
  };
  
  const getStrokeColor = (r: number) => {
      if (r >= 80) return "#c084fc"; // purple-400
      if (r >= 50) return "#4ade80"; // green-400
      if (r >= 20) return "#facc15"; // yellow-400
      return "#f87171"; // red-400
  };

  const scoreColor = getScoreColor(privacyRatio);
  const strokeColor = getStrokeColor(privacyRatio);
  
  // Circumference for SVG circle
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (privacyRatio / 100) * circumference;

  return (
    <>
    <ShieldModal 
        isOpen={showShieldModal}
        onClose={() => {
            setShowShieldModal(false);
            refetchPrivateBalances();
        }}
        tongoAccounts={tongoAccounts}
        privateBalances={privateBalances}
        initialMode="shield"
    />
    
    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl mb-8">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-900/40 blur-[80px] rounded-full pointer-events-none" />

      <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
        {/* Circle Progress */}
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="#374151" // gray-700
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke={strokeColor}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-xl font-bold ${scoreColor}`}>
              {privacyRatio.toFixed(0)}%
            </span>
            <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">
              Shielded
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-white text-lg font-bold flex items-center gap-2">
             <Shield size={18} className={scoreColor} />
             Ghost Score <span className="text-gray-500 text-xs font-normal bg-gray-800 px-2 py-0.5 rounded-full">BETA</span>
          </h3>
          <p className="text-gray-400 text-sm max-w-xs mt-1">
             {privacyRatio < 20 ? (
                 "Your treasury is highly exposed. Shield assets to increase privacy."
             ) : privacyRatio < 80 ? (
                 "Good balance. Shield more to reach maximum anonymity."
             ) : (
                 "Excellent privacy. Your treasury is effectively invisible."
             )}
          </p>
          
          <div className="flex gap-4 mt-3 text-xs font-mono">
              <div>
                  <span className="text-gray-500 block mb-0.5">Public</span>
                  {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
                  <span className="text-white font-bold">${totalPublicUsd.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
              </div>
              <div className="w-px bg-gray-700 h-full" />
              <div>
                  <span className="text-purple-400 block mb-0.5">Private</span>
                  <span className="text-white font-bold">${totalPrivateUsd.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
              </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full md:w-auto">
        {privacyRatio < 100 && (
            <button 
                onClick={() => setShowShieldModal(true)}
                className="w-full md:w-auto px-6 py-4 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-white/5 active:scale-95"
            >
                <ArrowUpRight size={18} />
                Boost Privacy
            </button>
        )}
      </div>
    </div>
    </>
  );
}
