"use client";
import { useAccount } from "@starknet-react/core";
import { useState } from "react";
import { Wallet } from "lucide-react";
import ConnectWalletModal from "./ConnectWalletModal";
import UserBar from "./UserBar";

function WalletConnectButton() {
  const { address } = useAccount();
  const [showConnectModal, setShowConnectModal] = useState<boolean>(false);

  return (
    <>
      <ConnectWalletModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
      />

      {address ? (
        <UserBar />
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
