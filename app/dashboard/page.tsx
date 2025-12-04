"use client";
import Link from "next/link";
import { usePayrollStore } from "@/store/payrollStore";
import EmployeeTable from "../employees/components/EmployeeTable";
import { useUIStore } from "@/store/uiStore";
import { useAccount, useBalance } from "@starknet-react/core";
import { STRK_ADDR } from "@/lib/data";
import { useEffect } from "react";

export default function Dashboard() {
  const { address } = useAccount();
  const employees = usePayrollStore((s) => s.employees);
  const total = employees.reduce((s, e) => s + Number(e.salary), 0);
  const hideAmounts = useUIStore((s) => s.hideAmounts);

  const { data: userBalance } = useBalance({
    address,
    token: STRK_ADDR,
    refetchInterval: 10000,
    watch: true,
  });

  return (
    <div className="py-10">
      <h2 className="text-4xl font-bold mb-8">Dashboard</h2>

      <div className="mb-20 grid grid-cols-3 gap-6">
        <div className="p-4 bg-white shadow-sm rounded">
          Wallet Balance
          <br />
          <strong
            className={`text-3xl ${
              hideAmounts
                ? "blur-sm select-none transition-all duration-200"
                : "transition-all duration-200"
            }`}
          >
            {userBalance ? parseFloat(userBalance.formatted).toFixed(2) : "-"}{" "}
            STRK
          </strong>
        </div>
        <div className="p-4 bg-white shadow-sm rounded">
          Employees
          <br />
          <strong className="text-3xl">{employees.length}</strong>
        </div>
        <div className="p-4 bg-white shadow-sm rounded">
          Total Payroll
          <br />
          <strong
            className={`text-3xl ${
              hideAmounts
                ? "blur-sm select-none transition-all duration-200"
                : "transition-all duration-200"
            }`}
          >
            {total.toFixed(2)} STRK
          </strong>
        </div>
      </div>

      <EmployeeTable />
      <div className="mt-6">
        <Link
          href="/employees"
          className="btn mr-4 border py-3 rounded-md px-5"
        >
          Manage Employees
        </Link>
        {employees.length > 0 && (
          <Link href="/distribute" className="btn border py-3 rounded-md px-5">
            Review & Distribute
          </Link>
        )}
      </div>
    </div>
  );
}
