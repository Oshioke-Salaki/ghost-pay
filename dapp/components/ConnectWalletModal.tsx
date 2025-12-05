"use client";
import { Connector, useConnect } from "@starknet-react/core";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Wallet, ArrowRight } from "lucide-react";

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ConnectWalletModal({ isOpen, onClose }: ConnectModalProps) {
  const { connectAsync, connectors } = useConnect();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleConnect = async (connector: Connector) => {
    try {
      await connectAsync({ connector });
      onClose();
    } catch (error) {
      console.error(`Failed to connect to ${connector.name}:`, error);
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 mx-4 transform transition-all animate-in zoom-in-95 duration-200 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Connect Wallet</h2>
            <p className="text-sm text-gray-500 mt-1">
              Select a Starknet wallet to continue
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {connectors.map((connector: Connector) => {
            const iconSrc =
              typeof connector.icon === "object"
                ? (connector.icon as any).dark
                : connector.icon;
            return (
              <button
                key={connector.id}
                onClick={() => handleConnect(connector)}
                className="group w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-black hover:shadow-md transition-all duration-200 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 p-1.5">
                    {iconSrc ? (
                      <img
                        src={iconSrc}
                        alt={connector.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Wallet size={20} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 group-hover:text-black">
                      {connector.name}
                    </div>
                    <div className="text-xs text-gray-500 group-hover:text-gray-700">
                      Detected
                    </div>
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all"
                />
              </button>
            );
          })}
        </div>

        <div className="mt-8 text-center pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            By connecting a wallet, you agree to GhostPay's <br />
            <a href="#" className="underline hover:text-black">
              Terms of Service
            </a>
            .
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ConnectWalletModal;
