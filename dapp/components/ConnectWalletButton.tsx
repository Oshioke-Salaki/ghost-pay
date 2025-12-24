"use client";
import { useAccount } from "@starknet-react/core";
import { useState } from "react";
import ConnectWalletModal from "./ConnectWalletModal";
import { shortenAddress } from "@/lib/utils";
import { LogOut, Wallet, User } from "lucide-react";
import WalletDisconnectModal from "./DisconnectWalletModal";

function WalletConnectButton() {
  const { address } = useAccount();
  const [showConnectModal, setShowConnectModal] = useState<boolean>(false);
  const [showDisconnectModal, setShowDisconnectModal] =
    useState<boolean>(false);

  return (
    <>
      <ConnectWalletModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
      />
      <WalletDisconnectModal
        isOpen={showDisconnectModal}
        onClose={() => setShowDisconnectModal(false)}
      />

      {address ? (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 pl-2 pr-2 py-1.5 rounded-full shadow-sm transition-all border bg-white border-gray-200 text-gray-700 hover:border-gray-300">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border bg-linear-to-tr from-gray-100 to-gray-200 border-gray-100`}
            >
              <User size={16} className="text-gray-600" />
            </div>

            <span
              className={`hidden md:block font-mono text-sm font-medium text-gray-700`}
            >
              {shortenAddress(address)}
            </span>

            <button
              onClick={() => setShowDisconnectModal(true)}
              className={`ml-1 p-1.5 rounded-full transition-all text-gray-400 hover:text-red-500 hover:bg-red-50`}
              title="Disconnect"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowConnectModal(true)}
          className={`flex items-center gap-2 py-2.5 px-5 rounded-full font-medium text-sm transition-all shadow-sm active:scale-95 bg-black text-white hover:bg-gray-800`}
        >
          <Wallet size={16} />
          <span>Connect Wallet</span>
        </button>
      )}
    </>
  );
}

export default WalletConnectButton;
