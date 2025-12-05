"use client";
import { TyphoonSDK } from "typhoon-sdk";
import { useState } from "react";
import { NextPage } from "next";
import { usePayrollStore } from "@/store/payrollStore";
import SuccessSummary from "./components/SuccessSummary";
import { useAccount } from "@starknet-react/core";
import { parseAmountToWei, shortenAddress } from "@/lib/utils";
import Link from "next/link";
import {
  Play,
  ArrowLeft,
  Ghost,
  Layers,
  Loader2,
  Terminal,
  User,
  Wallet,
} from "lucide-react";
import { Call } from "starknet";
import { motion, AnimatePresence } from "framer-motion";
import WalletConnectButton from "@/components/ConnectWalletButton";
import { STRK_ADDR } from "@/lib/data";

const DistributePage: NextPage = () => {
  const sdk = new TyphoonSDK();
  const { account } = useAccount();
  const employees = usePayrollStore((state) => state.employees);

  const [status, setStatus] = useState<
    "idle" | "preparing" | "signing" | "distributing" | "completed"
  >("idle");
  const [logs, setLogs] = useState<string[]>([]);

  const totalAmount = employees.reduce((sum, e) => sum + e.salary, 0);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, msg]);
  };

  const handleBatchDistribute = async () => {
    if (!account || employees.length === 0) return;

    try {
      setStatus("preparing");
      addLog("Initializing Multicall sequence...");

      await new Promise((r) => setTimeout(r, 800));

      const allCalls: Call[] = [];
      for (const emp of employees) {
        const weiAmount = parseAmountToWei(emp.salary);
        const empCalls = await sdk.generate_approve_and_deposit_calls(
          weiAmount,
          STRK_ADDR
        );
        allCalls.push(...empCalls);
        addLog(`- Packed payload: ${emp.first_name} (${emp.salary} STRK)`);
      }

      setStatus("signing");
      addLog("Requesting Employer Authorization...");

      const multiCall = await account.execute(allCalls);

      setStatus("distributing");
      addLog(`Broadcasted: ${multiCall.transaction_hash.slice(0, 10)}...`);
      addLog("Waiting for block confirmation...");

      await account.waitForTransaction(multiCall.transaction_hash);
      addLog("Block confirmed. Funds obfuscated.");

      addLog("Downloading ZK Notes...");
      await sdk.download_notes(multiCall.transaction_hash);

      addLog("Initiating private withdrawals...");
      const recipientAddresses = employees.map((e) => e.address);
      await sdk.withdraw(multiCall.transaction_hash, recipientAddresses);

      addLog("Sequence complete.");
      setStatus("completed");
    } catch (err: any) {
      console.error(err);
      addLog(`Error: ${err.message}`);
      alert("Batch execution failed.");
      setStatus("idle");
    }
  };

  // Gatekeeper
  if (!account) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 p-8 rounded-2xl border border-gray-200 max-w-md w-full shadow-sm"
        >
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Ghost size={32} className="text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
          <div className="flex justify-center mt-6">
            <WalletConnectButton />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-12 px-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-black flex items-center gap-1 mb-4 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          Batch Distribution <Layers className="text-gray-400" />
        </h1>
      </div>

      {employees.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500">No employees found.</p>
          <Link href="/employees" className="text-blue-600 underline">
            Add Employees
          </Link>
        </div>
      )}

      {employees.length > 0 && (
        <AnimatePresence mode="wait">
          {status !== "completed" ? (
            <motion.div
              key="processing-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8"
            >
              {/* Stats Header */}
              <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-8">
                <div>
                  <h3 className="text-lg font-bold">Session Overview</h3>
                  <p className="text-gray-500">
                    Total Volume:{" "}
                    <span className="font-mono font-medium text-black">
                      {totalAmount.toFixed(2)} STRK
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <motion.span
                    key={employees.length}
                    initial={{ scale: 1.5, color: "#8b5cf6" }}
                    animate={{ scale: 1, color: "#000" }}
                    className="block text-3xl font-bold"
                  >
                    {employees.length}
                  </motion.span>
                  <span className="text-xs text-gray-400 uppercase tracking-wider">
                    Recipients
                  </span>
                </div>
              </div>

              {status === "idle" ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {/* --- NEW: EMPLOYEE MANIFEST REVIEW --- */}
                  <div className="mb-8">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      Review Manifest
                    </h4>
                    <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                      <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {employees.map((emp, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                                <User size={14} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">
                                  {emp.first_name} {emp.last_name}
                                </p>
                                <p className="text-xs text-gray-400 font-mono flex items-center gap-1">
                                  <Wallet size={10} />{" "}
                                  {shortenAddress(emp.address as `0x${string}`)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-mono font-medium text-sm">
                                {emp.salary.toFixed(2)} STRK
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* ------------------------------------- */}

                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-8 text-sm text-blue-800 flex items-start gap-3">
                    <Ghost className="shrink-0 mt-0.5" size={16} />
                    <p>
                      <strong>Ready to vanish.</strong> GhostPay will bundle{" "}
                      {employees.length} transfers into a single atomic
                      transaction.
                    </p>
                  </div>
                  <button
                    onClick={handleBatchDistribute}
                    className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <Play size={20} fill="currentColor" /> Initiate Protocol
                  </button>
                </motion.div>
              ) : (
                // THE ANIMATED TERMINAL
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Status Indicator */}
                  <div className="flex items-center gap-3 mb-4 p-2 bg-gray-50 rounded-lg">
                    {status === "signing" && (
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                      </span>
                    )}
                    {status === "preparing" && (
                      <Loader2
                        className="animate-spin text-gray-400"
                        size={16}
                      />
                    )}
                    {status === "distributing" && (
                      <Loader2
                        className="animate-spin text-purple-600"
                        size={16}
                      />
                    )}

                    <h3 className="font-mono font-bold uppercase text-xs tracking-widest text-gray-600">
                      {status === "preparing" && "Preparing ZK Proofs..."}
                      {status === "signing" && "Waiting for Signature..."}
                      {status === "distributing" &&
                        "Executing On-Chain Ritual..."}
                    </h3>
                  </div>

                  {/* Terminal Window */}
                  <div className="bg-black rounded-xl p-6 h-72 overflow-hidden relative shadow-inner font-mono text-xs">
                    <div className="absolute top-0 left-0 w-full h-8 bg-gray-800 flex items-center px-4 gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="ml-2 text-gray-400 flex items-center gap-1">
                        <Terminal size={10} /> typhoon-sdk
                      </span>
                    </div>
                    <div className="mt-6 h-full overflow-y-auto pb-8 custom-scrollbar">
                      {logs.map((log, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="mb-1 text-green-400 border-l-2 border-green-800 pl-2"
                        >
                          <span className="text-gray-600 mr-2">
                            [{new Date().toLocaleTimeString()}]
                          </span>
                          {log}
                        </motion.div>
                      ))}
                      <motion.div
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-2 h-4 bg-green-500 ml-2"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            // SUCCESS STATE
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <SuccessSummary employees={employees} totalAmount={totalAmount} />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default DistributePage;
