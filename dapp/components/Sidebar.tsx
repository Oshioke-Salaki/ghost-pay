"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/uiStore";
import {
  Ghost,
  LayoutDashboard,
  Building2,
  Zap,
  Landmark,
  X,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, setSidebarOpen } = useUIStore();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Treasury", href: "/finance", icon: Landmark },
    { name: "Organizations", href: "/organizations", icon: Building2 },
    { name: "Instant Pay", href: "/instant-pay", icon: Zap },
  ];

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 transform md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:block h-screen`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
            <Link
              href="/"
              className="flex items-center gap-2 group"
              onClick={handleLinkClick}
            >
              <div className="p-1.5 rounded-lg bg-black text-white group-hover:scale-105 transition-transform">
                <Ghost size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">
                GhostPay
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-500 hover:text-gray-900"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive
                      ? "bg-gray-100 text-black shadow-sm"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    size={20}
                    className={isActive ? "text-black" : "text-gray-400"}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Area (Optional: Version or extra links) */}
          {/* <div className="p-6 border-t border-gray-100">
            <div className="text-xs text-gray-400 font-mono">
              GhostPay v2.0
              <br />
              Status: <span className="text-green-500">● Online</span>
            </div>
          </div> */}
        </div>
      </aside>
    </>
  );
}
