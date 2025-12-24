"use client";
import Link from "next/link";
import WalletConnectButton from "./ConnectWalletButton";
import { useAccount } from "@starknet-react/core";
import ToggleAmountsDisplay from "./ToggleAmountsDisplay";
import { usePathname } from "next/navigation";
import {
  Ghost,
  LayoutDashboard,
  Users,
  Sparkles,
  CircleDollarSign,
  Building2,
} from "lucide-react";

export default function Navbar() {
  const { account } = useAccount();
  const pathname = usePathname();

  return (
    <nav
      className={`
        w-full transition-colors duration-300 border-b bg-white border-gray-200 text-gray-900
      `}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className={`p-1.5 rounded-lg transition-colors bg-black text-white`}
          >
            <Ghost size={20} />
          </div>
          <span className={`font-bold text-xl tracking-tight text-gray-900`}>
            GhostPay
          </span>
        </Link>

        {account && (
          <div
            className={`hidden md:flex items-center gap-1 p-1 rounded-full border transition-colors bg-gray-100/50 border-gray-200`}
          >
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                pathname === "/dashboard"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
            <Link
              href="/finance"
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                pathname === "/finance"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <CircleDollarSign size={16} />
              Finance
            </Link>
            <Link
              href="/organizations"
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                pathname === "/organizations"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Building2 size={16} />
              Organizations
            </Link>
          </div>
        )}

        <div className="flex items-center gap-3">
          {account && (
            <>
              {pathname !== "/" && (
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
