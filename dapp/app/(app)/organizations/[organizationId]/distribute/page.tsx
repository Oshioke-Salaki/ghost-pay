"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useProvider, useBalance } from "@starknet-react/core";
import { Call, CallData } from "starknet";
import { parseUnits, formatUnits } from "ethers";
import {
  Play,
  ArrowLeft,
  Ghost,
  Layers,
  Loader2,
  Terminal,
  ShieldAlert,
  Wallet,
  Lock,
  CheckCircle2,
  AlertCircle,
  Building2,
  User,
  FileText,
  ChevronDown,
  RefreshCw,
  Coins
} from "lucide-react";

import { usePayrollStore } from "@/store/payrollStore";
import { useOrganizationStore } from "@/store/organizationStore";
import { useTongoAccount } from "@/hooks/useTongoAccount";
import { supabase } from "@/utils/superbase/server";
import { shortenAddress } from "@/lib/utils";
import { TONGO_CONTRACTS } from "@/lib/tongoData";
import { useAvnuPrice } from "@/hooks/useAvnuPrice";

import SuccessSummary from "./components/SuccessSummary"; // Reusing existing component
import WalletConnectButton from "@/components/ConnectWalletButton";

// Hardcoded Logos (Shared)
const TOKEN_LOGOS: Record<string, string> = {
  STRK: "/starknetlogo.svg",
  ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026",
  USDC: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026",
  USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=026",
  WBTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026",
};

export default function OrganizationDistributePage() {
  const { organizationId } = useParams();
  const router = useRouter();
  const { account, address } = useAccount();
  const { provider } = useProvider();

  // Stores
  const { employees } = usePayrollStore();
  const {
    organizations,
    activeOrganization,
    setActiveOrganization,
    fetchOrganizations,
  } = useOrganizationStore();

  // Tongo & Balance State
  const { tongoAccounts, initializeTongo, isInitializing, conversionRates } =
    useTongoAccount();
    
  // State for Multi-Currency
  const [selectedToken, setSelectedToken] = useState("STRK");
  const tokens = Object.keys(TONGO_CONTRACTS["mainnet"]);
  const currentTokenInfo = TONGO_CONTRACTS["mainnet"][selectedToken as keyof typeof TONGO_CONTRACTS["mainnet"]];

  // Price Fetching
  const { price: tokenPrice, loading: priceLoading } = useAvnuPrice(selectedToken);

  const [privateBalance, setPrivateBalance] = useState(0n);

  // Page State
  const [loadingData, setLoadingData] = useState(true);
  const [paymentSource, setPaymentSource] = useState<"public" | "private">(
    "public"
  );
  const [status, setStatus] = useState<
    "idle" | "preparing" | "signing" | "distributing" | "completed"
  >("idle");
  const [logs, setLogs] = useState<string[]>([]);

  // 1. First Load Sync
  useEffect(() => {
    if (!address || !organizationId) return;

    const initPage = async () => {
      setLoadingData(true);

      // A. Sync Active organization
      if (organizations.length === 0) {
        await fetchOrganizations(address);
      }

      const targetId = Array.isArray(organizationId)
        ? organizationId[0]
        : organizationId;
      const targetOrganization = organizations.find((c) => c.id === targetId);

      if (
        targetOrganization &&
        targetOrganization.id !== activeOrganization?.id
      ) {
        setActiveOrganization(targetOrganization);
      }

      // B. Fetch Employees
      const { data: roster, error } = await supabase
        .from("employees")
        .select("*")
        .eq("organization_id", targetId)
        .eq("is_active", true);

      if (roster && !error) {
        usePayrollStore.setState({
          employees: roster.map((d: any) => ({
            first_name: d.first_name,
            last_name: d.last_name,
            address: d.address,
            salary_usd: Number(d.salary_usd), // Use salary_usd
            employer_address: d.employer_address,
            organization_id: d.organization_id,
            is_active: true,
          })),
        });
      }

      setLoadingData(false);
    };

    initPage();
  }, [organizationId, address, organizations, activeOrganization]); // Removed infinite loop deps

  // 2. Fetch Private Balance
  useEffect(() => {
    const fetchPrivBalance = async () => {
      const tongoAccount = tongoAccounts?.[selectedToken];
      if (!tongoAccount) {
        setPrivateBalance(0n);
        return;
      }
      try {
        const state = await tongoAccount.state();
        setPrivateBalance(state.balance);
      } catch (e) {
        console.error(e);
      }
    };
    if (tongoAccounts) fetchPrivBalance();
  }, [tongoAccounts, selectedToken]);

  // 3. Public Balance
  const { data: publicBalanceData } = useBalance({
    address,
    token: currentTokenInfo?.erc20 as `0x${string}`,
    watch: true,
    refetchInterval: 10000,
  });

  // --- CALCULATIONS ---
  const totalSalaryUSD = employees.reduce((sum, e) => sum + (e.salary_usd || 0), 0);
  
  // Dynamic Crypto Calculation
  const estimatedTotalTokens = tokenPrice > 0 ? totalSalaryUSD / tokenPrice : 0;
  
  const decimals = publicBalanceData?.decimals || (['USDC', 'USDT'].includes(selectedToken) ? 6 : 18);
  
  // Helper to get formatted string for display
  const formatTokenAmount = (amount: number) => {
      return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  };

  // Check Funds
  const publicBalanceVal = publicBalanceData ? parseFloat(publicBalanceData.formatted) : 0;
  const hasPublicFunds = publicBalanceVal >= estimatedTotalTokens;

  // Private Check
  const currentRate = conversionRates?.[selectedToken] || 0n;
  // Private Balance is in Tongo Units. 
  // We need Tongo Units needed = (TokenWei) / Rate
  const totalTokenWei = parseUnits(estimatedTotalTokens.toFixed(decimals), decimals);
  const totalTongoUnitsNeeded = currentRate > 0n ? totalTokenWei / currentRate : 0n;
  const hasPrivateFunds = privateBalance >= totalTongoUnitsNeeded;

  const isBalanceSufficient =
    paymentSource === "public" ? hasPublicFunds : hasPrivateFunds;

  const addLog = (msg: string) => setLogs((prev) => [...prev, msg]);

  // --- EXECUTE ---
  const handleBatchDistribute = async () => {
    if (!account || employees.length === 0) return;
    if (!isBalanceSufficient)
      return alert(`Insufficient funds in ${paymentSource} source.`);
    if (tokenPrice <= 0) return alert("Price feed error. Cannot calculate payout.");

    try {
      setStatus("preparing");
      setLogs([]);
      const allCalls: Call[] = [];

      addLog(`Initiating USD Payroll Run ($${totalSalaryUSD.toFixed(2)})`);
      addLog(`Selected Currency: ${selectedToken} @ $${tokenPrice.toFixed(4)}`);

      if (paymentSource === "public") {
        addLog(`Mode: Standard Public Distribution`);

        for (const emp of employees) {
          const tokenAmount = (emp.salary_usd || 0) / tokenPrice;
          const weiAmount = parseUnits(tokenAmount.toFixed(decimals), decimals);
          
          allCalls.push({
            contractAddress: currentTokenInfo.erc20,
            entrypoint: "transfer",
            calldata: CallData.compile({
              recipient: emp.address,
              amount: { low: weiAmount, high: 0 },
            }),
          });
          addLog(`• Queued: ${emp.first_name} ($${emp.salary_usd} -> ${tokenAmount.toFixed(4)} ${selectedToken})`);
        }
      } else {
        addLog("Mode: Confidential Transfer (Ghost Protocol)");
        const tongoAccount = tongoAccounts?.[selectedToken];
        
        if (!tongoAccount || !currentRate)
          throw new Error("Private identity not initialized.");

        for (const [index, emp] of employees.entries()) {
          addLog(`[${index + 1}/${employees.length}] Securing payment for ${emp.first_name}...`);
          await new Promise((r) => setTimeout(r, 50)); 

          const tokenAmount = (emp.salary_usd || 0) / tokenPrice;
          const weiAmount = parseUnits(tokenAmount.toFixed(decimals), decimals);
          const tongoUnits = weiAmount / currentRate;

          const op = await tongoAccount.withdraw({
            sender: address!,
            amount: tongoUnits,
            to: emp.address,
          });
          allCalls.push(op.toCalldata());
        }
      }

      setStatus("signing");
      addLog(`Preparing ${allCalls.length} transactions...`);
      const multiCall = await account.execute(allCalls);

      setStatus("distributing");
      addLog(`Processing: ${multiCall.transaction_hash.slice(0, 10)}...`);
      await provider.waitForTransaction(multiCall.transaction_hash);

      // Save Run to DB
      await supabase.from("payroll_runs").insert({
        organization_id: activeOrganization?.id,
        total_amount: totalSalaryUSD, // Store USD Amount
        currency: "USD", // Logic changed to USD base
        recipient_count: employees.length,
        tx_hash: multiCall.transaction_hash,
        status: "completed",
        details: {
             token: selectedToken,
             price_at_execution: tokenPrice,
             recipients: employees.map(e => ({
                 name: e.first_name,
                 usd: e.salary_usd,
                 token_amount: (e.salary_usd || 0) / tokenPrice
             }))
        },
      });

      addLog("Distribution complete.");
      setStatus("completed");
    } catch (err: any) {
      console.error(err);
      addLog(`❌ Error: ${err.message}`);
      setStatus("idle");
    }
  };

  // --- RENDER ---
  if (!address) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 max-w-md w-full shadow-sm">
          <ShieldAlert size={32} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
          <div className="flex justify-center mt-4">
            <WalletConnectButton />
          </div>
        </div>
      </div>
    );
  }

  if (loadingData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="py-12 px-6 md:px-[120px] max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <Link
          href={`/employees?org=${organizationId}`}
          className="text-sm text-gray-500 hover:text-black flex items-center gap-1 mb-4 transition-colors"
        >
          <ArrowLeft size={16} /> Edit Roster
        </Link>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-black text-white rounded-xl">
            <Layers size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Run Payroll
            </h1>
            <p className="text-gray-500 text-sm">
              {activeOrganization?.name} <span className="mx-2">•</span>{" "}
              {employees.length} Recipients
            </p>
          </div>
        </div>
      </div>

      {employees.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">
            No active employees found to pay.
          </p>
          <Link
            href={`/employees?org=${organizationId}`}
            className="text-black font-bold underline hover:no-underline"
          >
            Add Employees
          </Link>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {status !== "completed" ? (
            <div className="grid lg:grid-cols-12 gap-8">
              {/* LEFT: Configuration & Action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-7 space-y-6"
              >
                {status === "idle" ? (
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    {/* 1. Payment Token Selection */}
                    <div className="mb-6">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
                            Select Payment Token
                        </label>
                        <div className="relative group">
                            <div className="flex items-center gap-3 w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-white p-1 flex items-center justify-center shadow-sm">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={TOKEN_LOGOS[selectedToken] || "/starknetlogo.svg"} alt={selectedToken} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-gray-900 text-lg leading-none">{selectedToken}</p>
                                <p className="text-xs text-gray-400 font-mono mt-1">
                                    {priceLoading ? "Fetching rate..." : `1 ${selectedToken} ≈ $${tokenPrice.toFixed(2)}`}
                                </p>
                            </div>
                            <ChevronDown size={20} className="text-gray-400" />
                            </div>
                            <select
                                value={selectedToken}
                                onChange={(e) => setSelectedToken(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            >
                                {tokens.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* 2. Source Selection */}
                    <div className="mb-8 grid grid-cols-1 gap-3">
                        {/* Public Option */}
                        <button
                          onClick={() => setPaymentSource("public")}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                            paymentSource === "public"
                              ? "border-black bg-gray-50"
                              : "border-gray-100 hover:border-gray-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${
                                paymentSource === "public"
                                  ? "bg-black text-white"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              <Wallet size={20} />
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-sm">Public Wallet</p>
                              <p className="text-xs text-gray-500">
                                Bal: {publicBalanceVal.toFixed(4)} {selectedToken}
                              </p>
                            </div>
                          </div>
                          {!hasPublicFunds && paymentSource === "public" && (
                              <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-1 rounded">
                                Low Funds
                              </span>
                          )}
                        </button>

                        {/* Private Option */}
                        <button
                          onClick={() => {
                            setPaymentSource("private");
                            if (!tongoAccounts || !tongoAccounts[selectedToken]) initializeTongo();
                          }}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                            paymentSource === "private"
                              ? "border-purple-600 bg-purple-50"
                              : "border-gray-100 hover:border-purple-100"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${
                                paymentSource === "private"
                                  ? "bg-purple-600 text-white"
                                  : "bg-purple-100 text-purple-400"
                              }`}
                            >
                              <Ghost size={20} />
                            </div>
                            <div className="text-left">
                              <p
                                className={`font-bold text-sm ${
                                  paymentSource === "private"
                                    ? "text-purple-900"
                                    : "text-gray-900"
                                }`}
                              >
                                Ghost Vault
                              </p>
                              <p className="text-xs text-purple-600/70">
                                {(!tongoAccounts || !tongoAccounts[selectedToken]) 
                                    ? "Click to unlock" 
                                    : `Bal: ${(parseFloat(formatUnits((privateBalance * (conversionRates?.[selectedToken] || 0n)).toString(), decimals))).toFixed(4)} t${selectedToken}`
                                }
                              </p>
                            </div>
                          </div>
                          {!hasPrivateFunds && paymentSource === "private" && tongoAccounts?.[selectedToken] && (
                             <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-1 rounded">
                               Low Funds
                             </span>
                          )}
                        </button>
                    </div>

                    {/* 3. Summary & Action */}
                    <div className="pt-6 border-t border-gray-100">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-sm text-gray-500 font-medium">
                          Total Payroll (USD)
                        </span>
                        <span className="text-xl font-bold font-mono">
                          ${totalSalaryUSD.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-end mb-6">
                        <span className="text-sm text-gray-500 font-medium">
                          Est. Token Payout
                        </span>
                        <div className="text-right">
                             <span className="text-2xl font-bold font-mono block leading-none">
                                {formatTokenAmount(estimatedTotalTokens)} {selectedToken}
                             </span>
                             <span className="text-xs text-gray-400">@ ${tokenPrice.toFixed(4)}/token</span>
                        </div>
                      </div>

                      {/* Buffer Warning */}
                      {isBalanceSufficient && paymentSource === "private" && (Number(formatUnits((privateBalance * (conversionRates?.[selectedToken] || 0n)).toString(), decimals)) < estimatedTotalTokens * 1.01) && (
                          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-xs text-yellow-700 flex items-start gap-2">
                              <AlertCircle size={16} className="mt-0.5" />
                              <p><strong>Volatility Warning:</strong> Your balance is very close to the required amount. Price shifts may cause failure. Recommend adding a buffer.</p>
                          </div>
                      )}

                      <button
                        onClick={handleBatchDistribute}
                        disabled={isInitializing || !isBalanceSufficient || priceLoading || tokenPrice <= 0}
                        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.99]
                                            ${
                                              !isBalanceSufficient || priceLoading
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                                                : paymentSource === "private"
                                                ? "bg-purple-900 text-white hover:bg-purple-950 shadow-purple-200"
                                                : "bg-black text-white hover:bg-gray-800"
                                            }`}
                      >
                        {isInitializing || priceLoading ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <Play size={20} fill="currentColor" />
                        )}
                        {paymentSource === "private"
                          ? "Run Shielded Payroll"
                          : "Run Public Payroll"}
                      </button>
                    </div>
                  </div>
                ) : (
                  // TERMINAL VIEW
                  <div className="bg-black text-white rounded-2xl p-6 h-[500px] flex flex-col shadow-2xl font-mono text-xs">
                    <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-4">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                      </div>
                      <span className="ml-auto text-gray-500">
                        GhostPay Terminal — v2.0
                      </span>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">

                        {logs.map((log, i) => (
                            <div key={i} className="text-green-400/90 break-all border-l-2 border-green-900 pl-2">
                                {log}
                            </div>
                        ))}
                      <div className="animate-pulse text-green-500">_</div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* RIGHT: Payroll Manifest */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-5"
              >
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-6">
                    <FileText size={20} className="text-gray-400" />
                    <h3 className="font-bold text-gray-900">
                      Payout Preview
                    </h3>
                    <span className="ml-auto bg-white border border-gray-200 text-xs font-mono px-2 py-1 rounded text-gray-500">
                      {employees.length} Entries
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2 space-y-2">
                    {employees.map((emp, i) => (
                      <div
                        key={i}
                        className="bg-white border border-gray-100 p-3 rounded-xl flex items-center justify-between shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">
                            {emp.first_name[0]}
                            {emp.last_name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {emp.first_name} {emp.last_name}
                            </p>
                            <p className="text-xs text-gray-400 font-mono">
                              ${(emp.salary_usd || 0).toLocaleString()} / mo
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-bold text-sm text-black">
                            {tokenPrice > 0 ? ((emp.salary_usd || 0) / tokenPrice).toFixed(2) : "..."}
                          </p>
                          <p className="text-[10px] text-gray-400">{selectedToken}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            // SUCCESS
            <SuccessSummary employees={employees} totalAmount={totalSalaryUSD} /> // Note: Passing USD total
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
