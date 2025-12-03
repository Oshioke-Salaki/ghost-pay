"use client";
import Link from "next/link";
import WalletButton from "./WalletButton";
import WalletConnectButton from "./ConnectWalletButton";
import { useAccount } from "@starknet-react/core";
import ToggleAmountsDisplay from "./ToggleAmountsDisplay";

export default function Navbar() {
  const { account } = useAccount();
  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="flex items-center justify-between py-4 px-10">
        <div className="flex items-center gap-1 text-2xl font-medium">
          👻
          <Link href="/">GhostPay</Link>
        </div>
        <div className="flex items-center gap-3">
          {account && (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/employees">Employees</Link>
            </>
          )}
          {/* <WalletButton /> */}
        </div>

        <div className="flex gap-x-2">
          <ToggleAmountsDisplay />
          <WalletConnectButton />
        </div>
      </div>
    </nav>
  );
}
