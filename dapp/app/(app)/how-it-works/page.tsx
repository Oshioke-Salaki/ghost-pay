"use client";
import React, { useState } from "react";
import { 
  Shield, 
  Wallet, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Lock, 
  Zap, 
  CreditCard,
  Briefcase,
  User,
  Layers
} from "lucide-react";
import Link from "next/link";

// Hardcoded Logo URLs for display
const TOKEN_LOGOS: Record<string, string> = {
  STRK: "/starknetlogo.svg",
  ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026",
  USDC: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026",
  USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=026",
  WBTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026",
};

export default function HowItWorks() {
  const [demoState, setDemoState] = useState<"public" | "private">("public");
  const [balance, setBalance] = useState(1000);

  const toggleDemo = () => {
    setDemoState(prev => prev === "public" ? "private" : "public");
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 pb-20">
      
      {/* Hero Section */}
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          Privacy for <span className="text-purple-600">Teams & Individuals</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Discover how Ghost Pay brings confidentiality to on-chain payroll and personal finance.
        </p>
      </div>

      {/* For Organizations (Payroll Flow) - MOVED FIRST */}
      <div className="mb-20">
        <div className="text-center mb-12">
           <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full font-bold text-sm mb-4">
              <Briefcase size={16} /> FOR ORGANIZATIONS
           </div>
           <h2 className="text-3xl font-bold text-gray-900 mb-4">Privacy-First Payroll</h2>
           <p className="text-lg text-gray-500">Run your payroll on-chain without exposing your employees' salaries.</p>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 -translate-y-1/2"></div>

          <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col items-center text-center hover:border-black transition-colors">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                    <Wallet size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">1. Fund Publicly</h3>
                  <p className="text-gray-500">Deposit payroll funds (USDC/STRK) into your organization's public wallet.</p>
              </div>

               {/* Step 2 */}
              <div className="bg-white p-8 rounded-3xl border border-purple-100 shadow-lg shadow-purple-500/5 flex flex-col items-center text-center relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                  <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Shield size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">2. Shield to Vault</h3>
                  <p className="text-gray-500">Move funds to the Ghost Vault. This breaks the on-chain link to your treasury.</p>
              </div>

               {/* Step 3 */}
              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col items-center text-center hover:border-green-500 transition-colors">
                  <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                    <Zap size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">3. Disburse Privately</h3>
                  <p className="text-gray-500">Send salaries directly to employees' private balances. Instant and confidential.</p>
              </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
           <Link href="/dashboard" className="text-purple-600 font-bold hover:underline">
              Start setting up your organization →
           </Link>
        </div>
      </div>

      {/* For Workers Section - NEW */}
      <div className="mb-20 bg-gray-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600 blur-[100px] opacity-20 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
           <div className="flex-1 space-y-6">
             <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-1.5 rounded-full font-bold text-sm border border-white/20">
                <User size={16} /> FOR WORKERS
                <span className="bg-purple-500 text-xs px-2 py-0.5 rounded ml-2">COMING SOON</span>
             </div>
             <h2 className="text-3xl md:text-4xl font-bold">Your Personal HQ</h2>
             <p className="text-gray-400 text-lg leading-relaxed">
               Manage your personal wealth with complete privacy. Shield your savings, pay friends, and track your net worth without the world watching.
             </p>
             <ul className="space-y-4">
                <li className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400"><Layers size={18} /></div>
                   <span className="font-medium">Unified Dashboard for Public & Private Assets</span>
                </li>
                <li className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400"><Shield size={18} /></div>
                   <span className="font-medium">One-click Asset Shielding</span>
                </li>
             </ul>
           </div>
           
           <div className="flex-1 w-full flex justify-center">
              {/* Abstract Visual for Personal HQ */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl w-full max-w-sm backdrop-blur-sm">
                 <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse"></div>
                       <div className="space-y-2">
                          <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
                          <div className="h-3 w-16 bg-gray-700/50 rounded animate-pulse"></div>
                       </div>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="h-16 w-full bg-gray-700/30 rounded-xl animate-pulse"></div>
                    <div className="h-16 w-full bg-gray-700/30 rounded-xl animate-pulse"></div>
                    <div className="h-16 w-full bg-gray-700/30 rounded-xl animate-pulse"></div>
                 </div>
                 <div className="mt-6 text-center text-sm text-gray-500">
                    Preview of Personal HQ
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Interactive Demo Section */}
      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl mb-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          <div className="flex-1 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Zap className="text-yellow-500 fill-yellow-500" /> 
              Try the Privacy Tech
            </h2>
            <p className="text-gray-600 text-lg">
              Click the button to see how <strong>Ghost Vault</strong> shields your assets from public view.
            </p>
            
            <button 
              onClick={toggleDemo}
              className={`group flex items-center gap-3 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg transform hover:-translate-y-1 ${
                demoState === "public" 
                  ? "bg-black text-white hover:bg-gray-800" 
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              {demoState === "public" ? (
                <>
                  <Shield size={24} /> Shield Assets
                </>
              ) : (
                <>
                  <Wallet size={24} /> Unshield to Public
                </>
              )}
            </button>
          </div>

          {/* The Phone/Card UI */}
          <div className="flex-1 w-full max-w-sm">
            <div className={`transition-all duration-500 transform ${demoState === "private" ? "scale-105" : "scale-100"}`}>
              <div className={`rounded-2xl p-6 border-2 transition-all duration-500 ${
                demoState === "public" 
                  ? "bg-white border-gray-200 shadow-sm" 
                  : "bg-gray-900 border-purple-500 shadow-purple-500/20 shadow-2xl"
              }`}>
                
                <div className="flex justify-between items-center mb-8">
                  <div className={`flex items-center gap-2 font-bold ${demoState === "public" ? "text-gray-900" : "text-white"}`}>
                    {demoState === "public" ? <Wallet size={20} /> : <Lock size={20} className="text-purple-400" />}
                    {demoState === "public" ? "Public Wallet" : "Ghost Vault"}
                  </div>
                  <div className={`text-xs font-mono px-2 py-1 rounded ${demoState === "public" ? "bg-gray-100 text-gray-500" : "bg-purple-900/50 text-purple-200"}`}>
                    {demoState === "public" ? "VISIBLE ON-CHAIN" : "ENCRYPTED"}
                  </div>
                </div>

                <div className="text-center py-8">
                  <p className={`text-sm mb-2 font-medium ${demoState === "public" ? "text-gray-400" : "text-gray-500"}`}>Total Balance</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className={`text-4xl font-bold tracking-tighter ${
                      demoState === "public" ? "text-gray-900" : "text-white"
                    }`}>
                      ${balance.toFixed(2)}
                    </span>
                    {demoState === "public" ? (
                      <Eye size={24} className="text-gray-400" />
                    ) : (
                      <EyeOff size={24} className="text-purple-400" />
                    )}
                  </div>
                </div>

                <div className={`mt-6 text-center text-sm ${demoState === "public" ? "text-gray-500" : "text-green-400"}`}>
                  {demoState === "public" 
                    ? "Anyone can see this balance." 
                    : "Only YOU can see this."}
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Steps Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <StepCard 
          icon={<Shield size={32} className="text-purple-600" />}
          title="1. Shield"
          description="Move assets from your public wallet into your Ghost Vault. They vanish from the blockchain explorer."
        />
        <StepCard 
          icon={<CreditCard size={32} className="text-blue-600" />}
          title="2. Transact"
          description="Send money privately to other Ghost Pay users. No one can track the transaction source."
        />
        <StepCard 
          icon={<Zap size={32} className="text-yellow-500" />}
          title="3. Manage"
          description="View your public and private net worth in one dashboard. Swap back to public anytime."
        />
      </div>

      {/* Supported Tokens Section - UPDATED WITH LOGOS */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Supported Assets</h2>
        <div className="flex flex-wrap justify-center gap-4 overflow-x-auto pb-4 px-2 no-scrollbar md:grid md:grid-cols-5 md:justify-items-center">
            {Object.keys(TOKEN_LOGOS).map((token) => (
              <div key={token} className="min-w-[130px] flex flex-col items-center gap-3 bg-gray-50 border border-gray-200 p-6 rounded-2xl hover:scale-105 transition-transform hover:shadow-md cursor-default">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={TOKEN_LOGOS[token]} alt={token} className="w-full h-full object-contain" />
                  </div>
                  <span className="font-bold text-gray-900">{token}</span>
              </div>
            ))}
        </div>
        <p className="text-center text-gray-500 mt-6 max-w-lg mx-auto">
          Ghost vault supports shielding and private transfers for all major assets on Starknet.
        </p>
      </div>

      {/* Partners Section - NEW */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Powered by Industry Leaders</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-4 hover:border-purple-200 transition-colors">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 p-3">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src="/starknetlogo.svg" alt="Starknet" className="w-full h-full object-contain" />
                </div>
                <div>
                   <h3 className="font-bold text-lg text-gray-900">Starknet</h3>
                   <p className="text-gray-500 text-sm">Built on Ethereum's leading L2 for speed & security.</p>
                </div>
             </div>

             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-4 hover:border-purple-200 transition-colors">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src="/tongo_logo.JPG" alt="Tongo" className="w-full h-full object-cover" />
                </div>
                <div>
                   <h3 className="font-bold text-lg text-gray-900">Tongo</h3>
                   <p className="text-gray-500 text-sm">The privacy protocol safeguarding your shielded assets.</p>
                </div>
             </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-4 hover:border-purple-200 transition-colors">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src="/avnu_logo.JPG" alt="Avnu" className="w-full h-full object-cover" />
                </div>
                <div>
                   <h3 className="font-bold text-lg text-gray-900">Avnu</h3>
                   <p className="text-gray-500 text-sm">Providing the best execution for all your token swaps.</p>
                </div>
             </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-xl hover:shadow-2xl"
        >
          Go to Dashboard <ArrowRight size={20} />
        </Link>
      </div>

    </div>
  );
}

function StepCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-purple-100 hover:shadow-lg transition-all text-center group">
      <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
