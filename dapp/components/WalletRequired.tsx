"use client";

import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import WalletConnectButton from "./ConnectWalletButton";

type WalletRequiredProps = {
  title?: string;
  description?: string;
};

export default function WalletRequired({
  title = "Access Restricted",
  description = "Connect your wallet to continue.",
}: WalletRequiredProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl border border-gray-200 max-w-md w-full shadow-sm"
      >
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
          <ShieldAlert size={32} />
        </div>

        <h2 className="text-2xl font-bold mb-2">{title}</h2>

        <p className="text-gray-500 mb-8">{description}</p>

        <div className="flex justify-center">
          <WalletConnectButton />
        </div>
      </motion.div>
    </div>
  );
}
