"use client";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import MobileFooterWrapper from "@/components/MobileFooterWrapper";
import { useViewModeStore } from "@/store/viewModeStore";
import { Loader2 } from "lucide-react";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isSwitching } = useViewModeStore();

  if (isSwitching) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white animate-in fade-in duration-300">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-black" size={48} />
            <p className="text-gray-500 font-medium tracking-tight">Switching HQ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-white p-6 relative">
          {children}
        </main>
        <MobileFooterWrapper />
      </div>
    </div>
  );
}
