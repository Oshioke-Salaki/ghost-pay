"use client";
import Link from "next/link";
import { usePayrollStore } from "@/store/payrollStore";
import EmployeeTable from "../employees/components/EmployeeTable";

export default function Dashboard() {
  const employees = usePayrollStore((s) => s.employees);
  const total = employees.reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div className="py-10">
      <h2 className="text-4xl font-bold mb-8">Dashboard</h2>

      <div className="mb-20 grid grid-cols-3 gap-6">
        <div className="p-4 bg-white shadow-sm rounded">
          Employees
          <br />
          <strong className="text-3xl">{employees.length}</strong>
        </div>
        <div className="p-4 bg-white shadow-sm rounded">
          Total Payroll
          <br />
          <strong className="text-3xl">{total} STRK</strong>
        </div>
        <div className="p-4 bg-white shadow-sm rounded">
          Next Batch
          <br />
          <strong className="text-3xl">—</strong>
        </div>
      </div>

      <EmployeeTable />
      <div className="mt-6">
        <Link
          href="/employees"
          className="btn mr-4 border-1 py-3 rounded-md px-5"
        >
          Manage Employees
        </Link>
        {employees.length > 0 && (
          <Link
            href="/distribute"
            className="btn border-1 py-3 rounded-md px-5"
          >
            Review & Distribute
          </Link>
        )}
      </div>
    </div>
  );
}
