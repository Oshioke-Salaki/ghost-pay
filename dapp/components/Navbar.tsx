"use client";
import Link from "next/link";
import WalletConnectButton from "./ConnectWalletButton";
import { useAccount } from "@starknet-react/core";
import ToggleAmountsDisplay from "./ToggleAmountsDisplay";
import { usePathname } from "next/navigation";
import { Ghost, LayoutDashboard, Users, Sparkles } from "lucide-react";

export default function Navbar() {
  const { account } = useAccount();
  const pathname = usePathname();

  // Check if we are in "Ghost Mode"
  const isGhostMode = pathname === "/ghost-transfer";

  return (
    <nav
      className={`
        w-full transition-colors duration-300 border-b
        ${
          isGhostMode
            ? "bg-black border-white/10 text-white"
            : "bg-white border-gray-200 text-gray-900"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className={`
            p-1.5 rounded-lg transition-colors
            ${isGhostMode ? "bg-white text-black" : "bg-black text-white"}
          `}
          >
            <Ghost size={20} />
          </div>
          <span
            className={`font-bold text-xl tracking-tight ${
              isGhostMode ? "text-white" : "text-gray-900"
            }`}
          >
            GhostPay
          </span>
        </Link>

        {account && (
          <div
            className={`
            hidden md:flex items-center gap-1 p-1 rounded-full border transition-colors
            ${
              isGhostMode
                ? "bg-white/5 border-white/10"
                : "bg-gray-100/50 border-gray-200"
            }
          `}
          >
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                pathname === "/dashboard"
                  ? isGhostMode
                    ? "bg-white/10 text-white"
                    : "bg-white text-black shadow-sm"
                  : isGhostMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
            <Link
              href="/employees"
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                pathname === "/employees"
                  ? isGhostMode
                    ? "bg-white/10 text-white"
                    : "bg-white text-black shadow-sm"
                  : isGhostMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Users size={16} />
              Employees
            </Link>
          </div>
        )}

        <div className="flex items-center gap-3">
          {account && (
            <>
              {!isGhostMode && (
                <Link
                  href="/ghost-transfer"
                  className="hidden md:flex items-center gap-2 bg-purple-900 hover:bg-purple-950 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md hover:shadow-purple-900/20 transition-all mr-2 group"
                >
                  <Sparkles
                    size={16}
                    className="text-purple-300 group-hover:animate-pulse"
                  />
                  Ghost Transfer
                </Link>
              )}

              {pathname !== "/" && !isGhostMode && (
                <div className="border-r border-gray-200 pr-3 mr-1">
                  <ToggleAmountsDisplay />
                </div>
              )}
            </>
          )}
          <WalletConnectButton />
        </div>
      </div>
    </nav>
  );
}
