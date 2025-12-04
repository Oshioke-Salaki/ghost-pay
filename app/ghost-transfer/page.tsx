"use client";
import { useState } from "react";
import { TyphoonSDK } from "typhoon-sdk";
import { useAccount, useBalance } from "@starknet-react/core";
import { parseAmountToWei } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { STRK_ADDR } from "@/lib/data";

export default function GhostTransfer() {
  const sdk = new TyphoonSDK();
  const { address, account } = useAccount();

  const { data: userBalance } = useBalance({
    address,
    token: STRK_ADDR,
    refetchInterval: 10000,
    watch: true,
  });

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const balance = parseFloat(userBalance?.formatted ?? "0").toFixed(2);

  const handlePercentageClick = (percent: number) => {
    const value = (Number(balance) * percent).toFixed(2);
    setAmount(value.toString());
  };

  const handleTransfer = async () => {
    if (!account) return alert("Connect your wallet first!");
    if (!recipient || !amount) return alert("Enter all fields");
    if (Number(amount) < 10) return alert("Minimum amount is 10 STRK");
    if (Number(amount) > Number(balance)) return alert("Insufficient balance");

    try {
      setLoading(true);
      setSuccess(false);

      const weiAmount = parseAmountToWei(Number(amount));

      const calls = await sdk.generate_approve_and_deposit_calls(
        weiAmount,
        STRK_ADDR
      );

      const multiCall = await account.execute(calls);
      await account.waitForTransaction(multiCall.transaction_hash);
      await sdk.download_notes(multiCall.transaction_hash);

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
      <p className="text-gray-600 mb-6">
        Transfer STRK anonymously to any wallet using Typhoon SDK.
      </p>

      {account && (
        <p className="text-gray-500 mb-4">
          Your balance: <strong>{balance} STRK</strong>
        </p>
      )}

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
          <div className="relative h-fit">
            <input
              type="number"
              min={10}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Minimum 10 STRK"
              className="w-full p-2 border rounded"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 transform flex gap-1">
              {[0.2, 0.5, 1].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePercentageClick(p)}
                  className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
                >
                  {p * 100}%
                </button>
              ))}
            </div>
          </div>
          <small className="text-gray-500 block mt-1">
            Minimum amount: 10 STRK
          </small>
        </label>

        <button
          onClick={handleTransfer}
          disabled={loading || Number(amount) < 10 || !amount || !recipient}
          className="w-full bg-[#4B0082] text-white py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed! flex justify-center items-center gap-2 transition-all duration-200 active:scale-95"
        >
          {loading ? (
            <Loader2
              size={20}
              className="animate-spin text-[#c4c4c4]"
              strokeWidth={2}
            />
          ) : (
            "Shadow send"
          )}
        </button>
      </div>

      {success && txHash && (
        <div className="p-4 bg-green-100 text-green-800 rounded mt-4">
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
