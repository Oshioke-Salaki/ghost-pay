"use client";
import Link from "next/link";
import { Ghost, ArrowRight } from "lucide-react";

export default function LandingNavbar() {
  return (
    <nav className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 rounded-lg bg-black text-white transition-transform group-hover:scale-105 duration-300">
            <Ghost size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">
            GhostPay
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 py-2 px-5 rounded-full font-medium text-sm transition-all bg-black text-white hover:bg-gray-800 hover:shadow-lg active:scale-95"
          >
            <span>Launch App</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
