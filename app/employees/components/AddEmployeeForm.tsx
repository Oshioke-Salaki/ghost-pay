"use client";
import React, { useState } from "react";
import { usePayrollStore } from "@/store/payrollStore";
import { useAccount } from "@starknet-react/core";

export default function AddEmployeeForm() {
  const { address: employerAddress } = useAccount();
  const add = usePayrollStore((s) => s.addEmployee);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (Number(amount) < 10) {
      alert("Amount must be at least 10 STRK");
      return;
    }

    add({
      first_name: firstName,
      last_name: lastName,
      address,
      salary: Number(amount),
      employer_address: employerAddress as string,
    });

    // Reset fields
    setFirstName("");
    setLastName("");
    setAddress("");
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          First Name
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="block p-2 mt-1 w-full border rounded"
            required
          />
        </label>

        <label className="block">
          Last Name
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="block p-2 mt-1 w-full border rounded"
            required
          />
        </label>
      </div>

      <label className="block">
        Wallet Address
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="block p-2 mt-1 w-full border rounded"
          required
        />
      </label>

      <label className="block">
        Amount (STRK)
        <input
          type="number"
          min={10}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="block p-2 mt-1 w-full border rounded"
          required
        />
        <span className="text-gray-500 text-sm mt-1 block">
          Minimum amount: 10 STRK
        </span>
      </label>

      <button className="mt-3 px-4 py-2 bg-black w-[150px] cursor-pointer text-white rounded">
        Add
      </button>
    </form>
  );
}
