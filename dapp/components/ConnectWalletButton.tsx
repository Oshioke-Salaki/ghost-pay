"use client";
import { useAccount } from "@starknet-react/core";
import { useState } from "react";
import ConnectWalletModal from "./ConnectWalletModal";
import { shortenAddress } from "@/lib/utils";
import { LogOut, Wallet, User } from "lucide-react";
import WalletDisconnectModal from "./DisconnectWalletModal";
import { usePathname } from "next/navigation";

function WalletConnectButton() {
  const { address } = useAccount();
  const pathname = usePathname();
  const [showConnectModal, setShowConnectModal] = useState<boolean>(false);
  const [showDisconnectModal, setShowDisconnectModal] =
    useState<boolean>(false);

  // Check if we are in "Ghost Mode"
  const isGhostMode = pathname === "/ghost-transfer";

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
        // --- Connected State ---
        <div className="flex items-center gap-2">
          <div
            className={`
              flex items-center gap-3 pl-2 pr-2 py-1.5 rounded-full shadow-sm transition-all border
              ${
                isGhostMode
                  ? "bg-white/10 border-white/20 text-white hover:border-white/40 hover:bg-white/15" // Ghost Theme (Glass)
                  : "bg-white border-gray-200 text-gray-700 hover:border-gray-300" // Light Theme
              }
            `}
          >
            {/* User Avatar Placeholder */}
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center border
                ${
                  isGhostMode
                    ? "bg-linear-to-tr from-purple-900 to-indigo-900 border-white/10"
                    : "bg-linear-to-tr from-gray-100 to-gray-200 border-gray-100"
                }
              `}
            >
              <User
                size={16}
                className={isGhostMode ? "text-purple-200" : "text-gray-600"}
              />
            </div>

            {/* Address */}
            <span
              className={`hidden md:block font-mono text-sm font-medium ${
                isGhostMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              {shortenAddress(address)}
            </span>

            {/* Disconnect Trigger */}
            <button
              onClick={() => setShowDisconnectModal(true)}
              className={`
                ml-1 p-1.5 rounded-full transition-all
                ${
                  isGhostMode
                    ? "text-gray-400 hover:text-red-400 hover:bg-white/10"
                    : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                }
              `}
              title="Disconnect"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      ) : (
        // --- Disconnected State ---
        <button
          onClick={() => setShowConnectModal(true)}
          className={`
            flex items-center gap-2 py-2.5 px-5 rounded-full font-medium text-sm transition-all shadow-sm active:scale-95
            ${
              isGhostMode
                ? "bg-white text-black hover:bg-gray-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]" // Ghost Theme (Inverted)
                : "bg-black text-white hover:bg-gray-800" // Light Theme
            }
          `}
        >
          <Wallet size={16} />
          <span>Connect Wallet</span>
        </button>
      )}
    </>
  );
}

export default WalletConnectButton;
