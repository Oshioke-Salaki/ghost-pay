"use client";
import { useState } from "react";
import Link from "next/link";
import { useAccount, useProvider } from "@starknet-react/core";
import {
  ArrowLeft,
  Zap,
  CheckCircle2,
  Loader2,
  FileText,
  ChevronDown,
} from "lucide-react";
import { useTongoAccount } from "@/hooks/useTongoAccount";
import { parseUnits, formatUnits } from "ethers";
import { CallData, PaymasterDetails } from "starknet";
import { TONGO_CONTRACTS } from "@/lib/tongoData";
import WalletConnectButton from "@/components/ConnectWalletButton";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import FundingSource from "./components/FundingSource";
import { usePrivateBalance } from "@/hooks/usePrivateBalance";

// Hardcoded Logos (Shared)
const TOKEN_LOGOS: Record<string, string> = {
  STRK: "/starknetlogo.svg",
  ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026",
  USDC: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026",
  USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=026",
  WBTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026",
};

export default function InstantPayPage() {
  const { address, account } = useAccount();
  const { provider } = useProvider();

  // Multi-Token Hook
  const { tongoAccounts, initializeTongo, isInitializing, conversionRates } =
    useTongoAccount();
  const { privateBalances } = usePrivateBalance({
    tongoAccounts,
    conversionRates,
  });

  const [recipientAddr, setRecipientAddr] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState<"public" | "private">("public");

  // Token Selection
  const [selectedToken, setSelectedToken] = useState("STRK");
  const tokens = Object.keys(TONGO_CONTRACTS["mainnet"]);
  const currentTokenInfo =
    TONGO_CONTRACTS["mainnet"][
      selectedToken as keyof (typeof TONGO_CONTRACTS)["mainnet"]
    ];

  const displaySymbol =
    source === "private" ? `t${selectedToken}` : selectedToken;

  const [status, setStatus] = useState<"idle" | "processing" | "success">(
    "idle",
  );
  const [txHash, setTxHash] = useState("");

  const handlePay = async () => {
    if (!account || !amount || !recipientAddr) return;
    setStatus("processing");

    try {
      const amountWei = parseUnits(amount, 18); // Check decimals if needed - ideally use token decimals

      const feeDetails: PaymasterDetails = {
        feeMode: {
          mode: "sponsored",
        },
      };

      if (source === "public") {
        const tx = await account.executePaymasterTransaction(
          [
            {
              contractAddress: currentTokenInfo.erc20,
              entrypoint: "transfer",
              calldata: CallData.compile({
                recipient: recipientAddr,
                amount: { low: amountWei, high: 0 },
              }),
            },
          ],
          feeDetails,
        );
        await provider.waitForTransaction(tx.transaction_hash);
        setTxHash(tx.transaction_hash);
      } else {
        const tongoAccount = tongoAccounts?.[selectedToken];
        const currentRate = conversionRates?.[selectedToken];

        if (!tongoAccount || !currentRate)
          throw new Error("Vault locked or rate missing");

        const tongoUnits = amountWei / currentRate;
        const privateBalanceStr = privateBalances[selectedToken] || "0";

        if (parseFloat(amount) > parseFloat(privateBalanceStr)) {
          throw new Error("Insufficient Private Balance");
        }

        const op = await tongoAccount.withdraw({
          sender: address!,
          amount: tongoUnits,
          to: recipientAddr,
        });
        const feeDetails: PaymasterDetails = {
          feeMode: {
            mode: "sponsored",
          },
        };

        const tx = await account.executePaymasterTransaction(
          [op.toCalldata()],
          feeDetails,
        );
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
      30,
    );
    doc.text(`DATE:         ${date}`, 14, 35);
    doc.text(
      `METHOD:       ${
        source === "private" ? "GHOST PROTOCOL (PRIVATE)" : "STANDARD TRANSFER"
      }`,
      14,
      40,
    );

    autoTable(doc, {
      startY: 50,
      head: [["DESCRIPTION", "BENEFICIARY", "AMOUNT"]],
      body: [
        [
          description || "Contractor Payment",
          `${recipientName} (${recipientAddr.slice(0, 6)}...)`,
          `${amount} ${selectedToken}`,
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
                <span className="font-bold text-gray-900">
                  {amount} {selectedToken}
                </span>
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
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Payment Details
              </h3>

              <div className="space-y-6">
                {/* Select Token with Logos */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
                    Select Currency
                  </label>
                  <div className="relative group">
                    <div className="flex items-center gap-3 w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-white p-1 flex items-center justify-center shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            TOKEN_LOGOS[selectedToken] || "/starknetlogo.svg"
                          }
                          alt={selectedToken}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-bold text-gray-900 text-lg flex-1">
                        {displaySymbol}
                      </span>
                      <ChevronDown size={20} className="text-gray-400" />
                    </div>

                    <select
                      value={selectedToken}
                      onChange={(e) => setSelectedToken(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    >
                      {tokens.map((t) => (
                        <option key={t} value={t}>
                          {source === "private" ? `t${t}` : t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

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
                    Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-2xl font-mono focus:outline-none focus:border-black transition-colors"
                    />

                    {/* Token Label Inside Input */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                      <img
                        src={TOKEN_LOGOS[selectedToken] || "/starknetlogo.svg"}
                        alt={selectedToken}
                        className="w-5 h-5 rounded-full"
                      />
                      <span className="text-sm font-bold text-gray-400">
                        {displaySymbol}
                      </span>
                    </div>
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
                  {status === "processing"
                    ? "Processing..."
                    : `Send ${displaySymbol}`}
                </button>
              </div>
            </div>

            <FundingSource
              tongoAccount={tongoAccounts?.[selectedToken] || null}
              initializeTongo={initializeTongo}
              address={address}
              source={source}
              setSource={setSource}
              privateBalance={privateBalances[selectedToken] || "0"}
              isInitializing={isInitializing}
              symbol={selectedToken}
              publicTokenAddress={currentTokenInfo?.erc20 || ""}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
