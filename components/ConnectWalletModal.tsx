"use client";
import { Connector, useConnect } from "@starknet-react/core";
import React, { useEffect } from "react";
// import { Button } from "./ui/button";
import { X } from "lucide-react";

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ConnectWalletModal({ isOpen, onClose }: ConnectModalProps) {
  const { connectAsync, connectors } = useConnect();

  useEffect(() => {
    console.log(connectors);
  }, [connectors]);

  const handleConnect = async (connector: Connector, walletType: string) => {
    try {
      await connectAsync({ connector });
      onClose();
    } catch (error) {
      console.error(`Failed to connect to ${walletType}:`, error);
    }
  };

  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-linear-to-b backdrop-blur-md from-rgba(14, 14, 16, 0.6) to-rgba(14, 14, 16, 0.6)  bg-opacity-0 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white text-black p-6 relative w-[550px] rounded-lg border border-[#c4c4c4]"
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={{
          boxShadow: "4px 4px 9.7px 0px #d7d7d7",
        }}
      >
        <button
          className="absolute top-4 right-4  cursor-pointer"
          onClick={onClose}
        >
          <X />
        </button>
        <h2 className="text-center text-2xl font-normal">Connect Wallet</h2>
        <h3 className="text-center text-base mb-9 font-light">
          Choose a wallet to connect to
        </h3>
        <div className="space-y-3 mt-6">
          {connectors.map((connector: Connector) => {
            return (
              <button
                key={connector.id}
                // variant="outline"
                className="w-full justify-start h-auto py-3 px-4 bg-[#c5c5c5] border-0  cursor-pointer rounded-sm text-black"
                onClick={() => handleConnect(connector, connector.id)}
              >
                <div className="flex items-center space-x-3">
                  <img src={connector.icon as string} className="w-7" alt="" />
                  <div className="text-left">
                    <div className="font-medium text-base">
                      {connector.name}
                    </div>
                    <div className="text-sm ">Connect to {connector.name}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ConnectWalletModal;
