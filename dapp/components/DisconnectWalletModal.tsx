"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, LogOut } from "lucide-react";
import { useDisconnect } from "@starknet-react/core";

interface WalletDisconnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletDisconnectModal({
  isOpen,
  onClose,
}: WalletDisconnectModalProps) {
  const { disconnectAsync } = useDisconnect();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleDisconnect = async () => {
    await disconnectAsync();
    onClose();
  };

  // Don't render anything on the server or if closed
  if (!mounted || !isOpen) return null;

  // 3. Render into document.body using createPortal
  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 mx-4 transform transition-all animate-in zoom-in-95 duration-200 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="text-center pt-2">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut size={32} className="text-red-500 ml-1" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Disconnect Wallet
          </h2>

          <p className="text-sm text-gray-500 mb-8 px-4">
            Are you sure you want to disconnect? You will need to reconnect to
            manage payroll.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleDisconnect}
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              Disconnect
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-black font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
