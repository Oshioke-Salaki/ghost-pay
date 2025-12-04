import Link from "next/link";
import { ShieldCheck, Users, Upload, Wallet, ArrowRight } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50 my-2">
      <div className="flex justify-between items-center py-10">
        <div className="flex-1">
          <h1 className="text-[54px] font-bold">GhostPay 👻</h1>
          <p className="text-gray-600 mb-10 text-2xl">
            Private payroll for Starknet — built with Typhoon SDK
          </p>

          <Link
            href="/dashboard"
            className="btn border rounded-md py-3 px-5 text-lg hover:bg-gray-100 transition"
          >
            Launch Dashboard
          </Link>
        </div>

        <img src="/ghost-pay-hero.png" className="w-[800px]" alt="" />
      </div>

      {/* WHY PRIVACY MATTERS */}
      <section className="py-20">
        <h2 className="text-3xl font-semibold text-center">
          Why privacy matters
        </h2>
        <p className="mt-4 text-gray-700 text-center max-w-2xl mx-auto text-lg">
          Salaries on-chain reveal sensitive data. Typhoon lets you distribute
          funds privately to employees and contractors without exposing amounts.
        </p>

        <img
          src="/ghost-privacy.png"
          className="w-[750px] mx-auto mt-20"
          alt=""
        />
      </section>

      {/* FEATURES */}
      <section className="py-20">
        <h2 className="text-3xl font-semibold text-center">Core Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-10">
          <div className="p-6 bg-white rounded-xl shadow-sm border text-center">
            <ShieldCheck className="mx-auto mb-4" size={38} />
            <h3 className="font-semibold text-xl">Private Transfers</h3>
            <p className="text-gray-600 mt-2">
              Send salaries without revealing employee earnings.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm border text-center">
            <Upload className="mx-auto mb-4" size={38} />
            <h3 className="font-semibold text-xl">CSV Upload</h3>
            <p className="text-gray-600 mt-2">
              Quickly import employee lists with wallet and salary details.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm border text-center">
            <Wallet className="mx-auto mb-4" size={38} />
            <h3 className="font-semibold text-xl">Automated Payouts</h3>
            <p className="text-gray-600 mt-2">
              Approve, deposit, and distribute in a few clicks.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20">
        <h2 className="text-3xl font-semibold text-center">How it works</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto mt-12 text-center">
          <div>
            <span className="text-4xl font-bold text-gray-800">1</span>
            <p className="mt-3 text-gray-600">Upload your employee CSV</p>
          </div>
          <div>
            <span className="text-4xl font-bold text-gray-800">2</span>
            <p className="mt-3 text-gray-600">Approve STRK spending</p>
          </div>
          <div>
            <span className="text-4xl font-bold text-gray-800">3</span>
            <p className="mt-3 text-gray-600">Deposit to GhostPay pool</p>
          </div>
          <div>
            <span className="text-4xl font-bold text-gray-800">4</span>
            <p className="mt-3 text-gray-600">Distribute privately</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-white">
        <h3 className="text-3xl font-semibold">Ready to get started?</h3>
        <p className="text-gray-600 mt-2">
          Launch the dashboard and begin a private payroll session.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-lg border text-lg hover:bg-gray-100 transition"
        >
          Launch Dashboard <ArrowRight size={20} />
        </Link>
      </section>
    </div>
  );
}
