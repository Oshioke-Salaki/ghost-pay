// src/pages/status.tsx

import React from "react";
import { NextPage } from "next";
import LoadingIndicator from "@/components/LoadingIndicator";
import AlertBanner from "@/components/AlertBanner";
import DataTable from "@/components/DataTable";
import { usePayrollStore } from "@/store/payrollStore";
import { Employee } from "@/types/employee";

const StatusPage: NextPage = () => {
  const employees = usePayrollStore((state) => state.employees);

  const columns: { header: string; accessor: keyof Employee }[] = [
    { header: "Address", accessor: "address" },
    { header: "Amount", accessor: "amount" },
    { header: "Deposit Tx", accessor: "depositTx" },
    { header: "Withdraw Tx", accessor: "withdrawTx" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Payroll Status</h1>
      {employees.length === 0 && (
        <AlertBanner message="No payroll data found." type="info" />
      )}
      {employees.length > 0 ? (
        <DataTable data={employees} columns={columns} />
      ) : (
        <LoadingIndicator message="Fetching payroll status..." />
      )}
    </div>
  );
};

export default StatusPage;
