"use client";
import { useAccount } from "@starknet-react/core";
import Image from "next/image";
import { useState } from "react";
import ConnectWalletModal from "./ConnectWalletModal";
import { shortenAddress } from "@/lib/utils";
import { LogOut } from "lucide-react";
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
        onClose={() => {
          setShowDisconnectModal(false);
        }}
      />
      {address ? (
        <div className="flex items-center gap-x-2 text-black">
          <div className="flex items-center gap-x-2  p-2 border border-[#515461] rounded-md">
            <img
              src="/accountUser.svg"
              alt="User Avatar"
              width={30}
              height={30}
            />
            <span className="hidden md:inline text-base">
              {shortenAddress(address)}
            </span>

            <button onClick={() => setShowDisconnectModal(true)}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          className="flex text-black py-2 px-3 border border-[#515461] rounded-md"
          onClick={() => setShowConnectModal(true)}
        >
          Connect Wallet
        </button>
      )}
    </>
  );
}

export default WalletConnectButton;
