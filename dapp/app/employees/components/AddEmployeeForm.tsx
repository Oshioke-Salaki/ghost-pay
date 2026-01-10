"use client";
import React, { useState } from "react";
import { usePayrollStore } from "@/store/payrollStore";
import { useAccount } from "@starknet-react/core";
import { Plus, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useOrganizationStore } from "@/store/organizationStore";

export default function AddEmployeeForm() {
  const { address: employerAddress } = useAccount();
  const add = usePayrollStore((s) => s.addEmployee);

  const params = useParams();
  const { activeOrganization } = useOrganizationStore();

  const organizationId = params.organizationId
    ? Array.isArray(params.organizationId)
      ? params.organizationId[0]
      : params.organizationId
    : activeOrganization?.id;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [position, setPosition] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!organizationId) {
      alert("No organization selected. Please select a organization first.");
      return;
    }

    setIsSubmitting(true);

    if (Number(amount) < 10) {
      alert("Amount must be at least 10 STRK");
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      add({
        first_name: firstName,
        last_name: lastName,
        address,
        salary: Number(amount),
        employer_address: employerAddress as string,
        organization_id: organizationId,
        position,
      });

      setFirstName("");
      setLastName("");
      setAddress("");
      setAmount("");
      setPosition("");
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            First Name
          </label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
            placeholder="Alice"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Last Name
          </label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
            placeholder="Stark"
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Position
        </label>
        <input
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
          placeholder="Software Engineer"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Wallet Address (Starknet)
        </label>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
          placeholder="0x..."
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Amount (STRK)
        </label>
        <input
          type="number"
          min={10}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
          placeholder="Min 10.00"
          required
        />
      </div>

      <button
        disabled={isSubmitting || !firstName || !address || !amount}
        className="w-full mt-4 bg-black text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <Plus size={18} />
        )}
        Add to Roster
      </button>
    </form>
  );
}
