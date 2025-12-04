"use client";
import React, { useState } from "react";
import { TyphoonSDK } from "typhoon-sdk";
import { useAccount } from "@starknet-react/core";
import { parseAmountToWei } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const STRK_ADDR =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

export default function PhantomPay() {
  const sdk = new TyphoonSDK();
  const { account } = useAccount();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleTransfer = async () => {
    if (!account) return alert("Connect your wallet first!");
    if (!recipient || !amount) return alert("Enter all fields");
    if (Number(amount) < 10) return alert("Minimum amount is 10 STRK");

    try {
      setLoading(true);
      setSuccess(false);

      const weiAmount = parseAmountToWei(Number(amount));

      // Generate deposit calls
      const calls = await sdk.generate_approve_and_deposit_calls(
        weiAmount,
        STRK_ADDR
      );

      // Execute deposit
      const multiCall = await account.execute(calls);
      await account.waitForTransaction(multiCall.transaction_hash);
      await sdk.download_notes(multiCall.transaction_hash);

      // Withdraw anonymously
      await sdk.withdraw(multiCall.transaction_hash, [recipient]);

      setTxHash(multiCall.transaction_hash);
      setSuccess(true);
      setRecipient("");
      setAmount("");
    } catch (err) {
      console.error(err);
      alert("Transfer failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow-md mt-20">
      <h1 className="text-2xl font-bold text-black">Ghost Transfer 👻</h1>
      <p className="text-gray-600 mb-10">
        Transfer STRK anonymously to any wallet using Typhoon SDK.
      </p>

      <div className="space-y-4">
        <label className="block">
          Recipient Address
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full p-2 mt-1 border rounded"
          />
        </label>

        <label className="block">
          Amount (STRK)
          <input
            type="number"
            min={10}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Minimum 10 STRK"
            className="w-full p-2 mt-1 border rounded"
          />
          <small className="text-gray-500">Minimum amount: 10 STRK</small>
        </label>

        <button
          onClick={handleTransfer}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {loading ? (
            <Loader2
              size={20}
              className="animate-spin text-[#c4c4c4]"
              strokeWidth={2}
            />
          ) : (
            "Send Anonymously"
          )}
        </button>
      </div>

      {success && txHash && (
        <div className="p-4 bg-green-100 text-green-800 rounded">
          Transfer successful! <br />
          Transaction Hash:{" "}
          <a
            href={`https://starkscan.co/tx/${txHash}`}
            target="_blank"
            className="underline"
          >
            {txHash}
          </a>
        </div>
      )}
    </div>
  );
}
