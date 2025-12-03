"use client";
import React, { useState } from "react";
import { usePayrollStore } from "@/store/payrollStore";

export default function AddEmployeeForm() {
  const add = usePayrollStore((s) => s.addEmployee);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        add({
          firstName,
          lastName,
          address,
          amount: Number(amount),
        });

        // Reset fields
        setFirstName("");
        setLastName("");
        setAddress("");
        setAmount("");
      }}
      className="space-y-3"
    >
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
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="block p-2 mt-1 w-full border rounded"
          required
        />
      </label>

      <button className="mt-3 px-4 py-2 bg-black w-[150px] cursor-pointer text-white rounded">
        Add
      </button>
    </form>
  );
}
