import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

function HeroSection() {
  return (
    <section className="pt-20 pb-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
          </span>
          Powered by Tongo Cash
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-black">
          Payroll for the <br />
          <span className="text-gray-400">Invisible Economy.</span>
        </h1>

        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Distribute salaries and contractor payments on Starknet without
          leaking sensitive financial data.
          <span className="font-mono text-sm bg-gray-100 px-1 py-0.5 rounded mx-1">
            100% On-chain
          </span>
          yet completely private.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="group h-12 px-8 flex items-center gap-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-all hover:scale-105"
          >
            Launch App
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>

      <div className="mt-20 max-w-5xl mx-auto bg-gray-50 rounded-xl border border-gray-200 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-white">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="p-8 font-mono text-sm text-gray-800 overflow-x-auto">
          <div className="min-w-[600px] space-y-4">
            <div className="flex justify-between border-b border-gray-200 pb-2 text-gray-400">
              <span>EMPLOYEE</span>
              <span>AMOUNT</span>
              <span>STATUS</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full" /> alice.stark
              </span>
              <span>4,500.00 STRK</span>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">
                PROCESSING
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full" /> bob.stark
              </span>
              <span>3,200.00 STRK</span>
              <span className="text-xs bg-black text-white px-2 py-1 rounded">
                VANISHED
              </span>
            </div>
            <div className="flex justify-between items-center opacity-50">
              <span className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full" /> charlie.stark
              </span>
              <span>Hidden</span>
              <span className="text-xs border border-gray-300 px-2 py-1 rounded">
                PENDING
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
