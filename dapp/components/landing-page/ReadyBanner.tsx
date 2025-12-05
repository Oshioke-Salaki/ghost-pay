import { Ghost } from "lucide-react";
import Link from "next/link";
import React from "react";

function ReadyBanner() {
  return (
    <section className="py-32 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
          Ready to go dark?
        </h2>
        <p className="text-xl text-gray-600 mb-10">
          Join the organizations protecting their financial data on Starknet.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-transform shadow-xl"
        >
          <Ghost size={20} />
          Initialize GhostPay
        </Link>
      </div>
    </section>
  );
}

export default ReadyBanner;
