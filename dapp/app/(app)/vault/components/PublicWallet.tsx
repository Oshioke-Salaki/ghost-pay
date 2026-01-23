import React, { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Wallet } from "lucide-react";
import { useBalance } from "@starknet-react/core";
import { ETH_ADDR, STRK_ADDR } from "@/lib/data";

function PublicWallet({
  address,
  setShowSwap,
}: {
  address: `0x${string}`;
  setShowSwap: Dispatch<SetStateAction<boolean>>;
}) {
  const { data: strkData } = useBalance({
    address,
    token: STRK_ADDR,
    watch: true,
  });
  const { data: ethData } = useBalance({
    address,
    token: ETH_ADDR,
    watch: true,
  });
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm flex flex-col relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gray-100 rounded-xl text-gray-600">
            <Wallet size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Public Wallet</h2>
            <p className="text-xs text-gray-500 font-mono">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          </div>
        </div>
        <div className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-500 uppercase tracking-wide">
          Visible
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {/* ETH Balance */}
        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:border-gray-300 transition-all">
          <div className="flex items-center gap-3">
            {/* Icon Placeholder */}
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
              <img
                src="https://imagedelivery.net/0xPAQaDtnQhBs8IzYRIlNg/e07829b7-0382-4e03-7ecd-a478c5aa9f00/logo"
                alt=""
              />
            </div>
            <span className="font-bold text-gray-700">ETH</span>
          </div>
          <span className="font-mono font-medium">
            {parseFloat(ethData?.formatted || "0").toFixed(4)}
          </span>
        </div>

        {/* STRK Balance */}
        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:border-gray-300 transition-all bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
              <img src="/starknetlogo.svg" alt="" />
            </div>
            <span className="font-bold text-gray-900">STRK</span>
          </div>
          <span className="font-mono font-bold text-xl">
            {parseFloat(strkData?.formatted || "0").toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mt-auto">
        <button
          onClick={() => setShowSwap(true)}
          className="w-full py-4 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw size={18} /> Swap Assets (AVNU)
        </button>
      </div>
    </motion.div>
  );
}

export default PublicWallet;
