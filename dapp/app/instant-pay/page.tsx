"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAccount, useProvider, useBalance } from "@starknet-react/core";
import {
  ArrowLeft,
  Zap,
  Wallet,
  Ghost,
  CheckCircle2,
  Loader2,
  FileText,
  ShieldCheck,
  Lock,
  AlertCircle,
} from "lucide-react";
import { useTongoAccount } from "@/hooks/useTongoAccount";
import { parseUnits, formatUnits } from "ethers";
import { CallData } from "starknet";
import { STRK_ADDR } from "@/lib/data";
import WalletConnectButton from "@/components/ConnectWalletButton";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function InstantPayPage() {
  const { address, account } = useAccount();
  const { provider } = useProvider();

  // Tongo Logic
  const { tongoAccount, initializeTongo, isInitializing, conversionRate } =
    useTongoAccount();
  const [privateBalance, setPrivateBalance] = useState("0.00");

  // Public Balance
  const { data: publicBalance } = useBalance({
    address,
    token: STRK_ADDR,
    watch: true,
  });

  // Form State
  const [recipientAddr, setRecipientAddr] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState<"public" | "private">("public");

  // Transaction State
  const [status, setStatus] = useState<"idle" | "processing" | "success">(
    "idle"
  );
  const [txHash, setTxHash] = useState("");

  // Fetch Private Balance
  useEffect(() => {
    const fetchPriv = async () => {
      if (!tongoAccount || !conversionRate) return;
      try {
        const state = await tongoAccount.state();
        const bal = state.balance * conversionRate;
        setPrivateBalance(formatUnits(bal.toString(), 18));
      } catch (e) {
        console.error(e);
      }
    };
    if (tongoAccount) fetchPriv();
  }, [tongoAccount, conversionRate]);

  // --- ACTIONS ---

  const handlePay = async () => {
    if (!account || !amount || !recipientAddr) return;
    setStatus("processing");

    try {
      const amountWei = parseUnits(amount, 18);

      if (source === "public") {
        // Standard Transfer
        const tx = await account.execute({
          contractAddress: STRK_ADDR,
          entrypoint: "transfer",
          calldata: CallData.compile({
            recipient: recipientAddr,
            amount: { low: amountWei, high: 0 },
          }),
        });
        await provider.waitForTransaction(tx.transaction_hash);
        setTxHash(tx.transaction_hash);
      } else {
        // Private Transfer (Withdraw)
        if (!tongoAccount || !conversionRate) throw new Error("Vault locked");

        const tongoUnits = amountWei / conversionRate;

        // Safety Check
        const currentPrivWei = parseUnits(privateBalance, 18);
        if (amountWei > currentPrivWei)
          throw new Error("Insufficient Private Balance");

        const op = await tongoAccount.withdraw({
          sender: address!,
          amount: tongoUnits,
          to: recipientAddr, // Send to external person
        });

        const tx = await account.execute([op.toCalldata()]);
        await provider.waitForTransaction(tx.transaction_hash);
        setTxHash(tx.transaction_hash);
      }
      setStatus("success");
    } catch (e: any) {
      console.error(e);
      alert("Payment failed: " + e.message);
      setStatus("idle");
    }
  };

  const generateVoucher = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleString();

    doc.setFont("courier", "bold");
    doc.setFontSize(20);
    doc.text("PAYMENT VOUCHER", 14, 20);

    doc.setFontSize(10);
    doc.setFont("courier", "normal");
    doc.text(
      `ID:           ${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      14,
      30
    );
    doc.text(`DATE:         ${date}`, 14, 35);
    doc.text(
      `METHOD:       ${
        source === "private" ? "GHOST PROTOCOL (PRIVATE)" : "STANDARD TRANSFER"
      }`,
      14,
      40
    );

    autoTable(doc, {
      startY: 50,
      head: [["DESCRIPTION", "BENEFICIARY", "AMOUNT"]],
      body: [
        [
          description || "Contractor Payment",
          `${recipientName} (${recipientAddr.slice(0, 6)}...)`,
          `${amount} STRK`,
        ],
      ],
      theme: "grid",
      styles: { font: "courier" },
      headStyles: { fillColor: [0, 0, 0] },
    });

    doc.text(`TX HASH: ${txHash}`, 14, (doc as any).lastAutoTable.finalY + 10);
    doc.save("payment_voucher.pdf");
  };

  if (!address) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 max-w-md w-full shadow-sm">
          <Zap size={32} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Instant Pay</h2>
          <p className="text-gray-500 mb-6">
            Connect wallet to send ad-hoc payments.
          </p>
          <div className="flex justify-center">
            <WalletConnectButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-6 md:px-[120px] max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-black flex items-center gap-1 mb-4 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200">
            <Zap size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Instant Pay</h1>
            <p className="text-gray-500 text-sm">
              One-time transfers for vendors and freelancers.
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm max-w-lg mx-auto"
          >
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Sent
            </h2>
            <p className="text-gray-500 mb-8">
              The funds have been transferred successfully.
            </p>

            <div className="bg-gray-50 p-4 rounded-xl text-left text-sm space-y-2 mb-8 font-mono border border-gray-100">
              <div className="flex justify-between">
                <span>To:</span>{" "}
                <span className="font-bold text-gray-900">{recipientName}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>{" "}
                <span className="font-bold text-gray-900">{amount} STRK</span>
              </div>
              <div className="flex justify-between">
                <span>Mode:</span>{" "}
                <span>
                  {source === "private" ? "Ghost Vault" : "Public Wallet"}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={generateVoucher}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <FileText size={18} /> Receipt
              </button>
              <button
                onClick={() => {
                  setStatus("idle");
                  setAmount("");
                  setRecipientAddr("");
                }}
                className="flex-1 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800"
              >
                New Payment
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-3 gap-8 items-start"
          >
            {/* LEFT: PAYMENT FORM */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Payment Details
              </h3>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
                      Service / Memo
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Logo Design"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
                    Recipient Wallet Address
                  </label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={recipientAddr}
                    onChange={(e) => setRecipientAddr(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
                    Amount (STRK)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-2xl font-mono focus:outline-none focus:border-black transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                      STRK
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100 flex justify-end">
                <button
                  onClick={handlePay}
                  disabled={
                    status === "processing" || !amount || !recipientAddr
                  }
                  className="px-8 py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg transition-all active:scale-95"
                >
                  {status === "processing" ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Zap size={18} fill="currentColor" />
                  )}
                  {status === "processing" ? "Processing..." : "Send Payment"}
                </button>
              </div>
            </div>

            {/* RIGHT: SOURCE SELECTOR */}
            <div className="space-y-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide px-1">
                Funding Source
              </p>

              {/* Option 1: Public */}
              <button
                onClick={() => setSource("public")}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  source === "public"
                    ? "border-black bg-white shadow-md"
                    : "border-transparent bg-gray-100 hover:bg-gray-200 text-gray-500"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-bold">
                    <Wallet size={18} /> Public Wallet
                  </div>
                  {source === "public" && (
                    <CheckCircle2 size={18} className="text-black" />
                  )}
                </div>
                <p className="text-xs opacity-70 mb-2">
                  Visible on-chain transaction.
                </p>
                <p className="text-sm font-mono font-bold">
                  {publicBalance
                    ? parseFloat(publicBalance.formatted).toFixed(2)
                    : "0.00"}{" "}
                  STRK
                </p>
              </button>

              {/* Option 2: Private */}
              <button
                onClick={() => {
                  setSource("private");
                  if (!tongoAccount) initializeTongo();
                }}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all relative overflow-hidden ${
                  source === "private"
                    ? "border-purple-600 bg-purple-50 text-purple-900 shadow-md"
                    : "border-transparent bg-gray-100 hover:bg-gray-200 text-gray-500"
                }`}
              >
                <div className="flex items-center justify-between mb-2 relative z-10">
                  <div className="flex items-center gap-2 font-bold">
                    <Ghost size={18} /> Ghost Vault
                  </div>
                  {tongoAccount ? (
                    source === "private" && (
                      <CheckCircle2 size={18} className="text-purple-600" />
                    )
                  ) : (
                    <Lock size={16} />
                  )}
                </div>
                <p className="text-xs opacity-70 mb-2 relative z-10">
                  Anonymous transfer via Tongo.
                </p>

                {tongoAccount ? (
                  <p className="text-sm font-mono font-bold relative z-10">
                    {parseFloat(privateBalance).toFixed(2)} tSTRK
                  </p>
                ) : (
                  <div className="flex items-center gap-1 text-xs font-bold bg-white/50 w-fit px-2 py-1 rounded">
                    {isInitializing ? "Unlocking..." : "Click to Unlock"}
                  </div>
                )}

                {/* Decoration */}
                {source === "private" && (
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-xl -mr-5 -mt-5"></div>
                )}
              </button>

              <div className="bg-blue-50 p-4 rounded-xl flex gap-3 items-start">
                <ShieldCheck
                  size={20}
                  className="text-blue-600 shrink-0 mt-0.5"
                />
                <p className="text-xs text-blue-800 leading-relaxed">
                  <strong>Pro Tip:</strong> Use the Ghost Vault for payments you
                  want to keep off your public ledger history.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
