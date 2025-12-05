"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { Ghost } from "lucide-react";

function Footer() {
  const pathname = usePathname();
  const isGhostMode = pathname === "/ghost-transfer";

  return (
    <footer
      className={`
      border-t transition-colors duration-300
      ${
        isGhostMode
          ? "bg-black border-white/10 text-gray-400"
          : "bg-white border-gray-200 text-gray-500"
      }
    `}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div
              className={`flex items-center gap-2 font-bold text-lg ${
                isGhostMode ? "text-white" : "text-gray-900"
              }`}
            >
              <Ghost size={20} /> GhostPay
            </div>
            <p className="text-sm opacity-80">
              Private payroll infrastructure for the Starknet ecosystem.
            </p>
          </div>

          {/* Status Badge */}
          <div
            className={`
            flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border
            ${
              isGhostMode
                ? "bg-white/5 border-white/10 text-gray-300"
                : "bg-gray-50 border-gray-200 text-gray-600"
            }
          `}
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Operational Status
          </div>
        </div>

        <div
          className={`
          mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center text-sm
          ${isGhostMode ? "border-white/10" : "border-gray-100"}
        `}
        >
          <p>© {new Date().getFullYear()} GhostPay Inc.</p>

          <div className="flex gap-6 mt-4 md:mt-0">
            <span
              className={`cursor-pointer transition-colors ${
                isGhostMode ? "hover:text-white" : "hover:text-black"
              }`}
            >
              Powered by Typhoon
            </span>
            <span
              className={`cursor-pointer transition-colors ${
                isGhostMode ? "hover:text-white" : "hover:text-black"
              }`}
            >
              Built on Starknet
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
