"use client";
import Link from "next/link";
import WalletConnectButton from "./ConnectWalletButton";
import { useAccount } from "@starknet-react/core";
import ToggleAmountsDisplay from "./ToggleAmountsDisplay";
import { usePathname } from "next/navigation";
import {
  Ghost,
  LayoutDashboard,
  CircleDollarSign,
  Building2,
  Menu,
} from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { useViewModeStore } from "@/store/viewModeStore";

export default function Navbar() {
  const { account } = useAccount();
  const pathname = usePathname();
  const { setSidebarOpen } = useUIStore();
  const { mode, setMode } = useViewModeStore();

  return (
    <nav
      className={`
        w-full transition-colors duration-300 border-b bg-white border-gray-200 text-gray-900 md:border-b-0
      `}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {pathname !== "/" && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
          )}

          {/* Logo - Hidden on desktop typically (in Sidebar), but SHOWN if we are on landing page or mobile */}
          <Link
            href="/"
            className={`flex items-center gap-2 group ${
              pathname === "/" ? "flex" : "flex md:hidden"
            }`}
          >
            <div className="p-1.5 rounded-lg bg-black text-white">
              <Ghost size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">
              GhostPay
            </span>
          </Link>
        </div>



        <div className="flex items-center gap-3 ml-auto">
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
