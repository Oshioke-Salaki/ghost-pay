"use client";
import { TyphoonSDK } from "typhoon-sdk";
import { useState } from "react";
import { NextPage } from "next";
import { usePayrollStore } from "@/store/payrollStore";
import DepositStep from "./components/DepositStep";
import WithdrawStep from "./components/WithdrawStep";
import DistributionProgress from "./components/DistributionProgress";
import SuccessSummary from "./components/SuccessSummary";
import { useAccount } from "@starknet-react/core";
import { parseAmountToWei } from "@/lib/utils";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

const STRK_ADDR =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

const DistributePage: NextPage = () => {
  const sdk = new TyphoonSDK();
  const { account } = useAccount();
  const employees = usePayrollStore((state) => state.employees);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingStep, setLoadingStep] = useState<"deposit" | "withdraw" | null>(
    null
  );
  const [completed, setCompleted] = useState(false);

  const handleDistribute = async () => {
    try {
      if (!account) return;
      if (employees.length === 0) return alert("No employees to distribute to");

      for (let i = 0; i < employees.length; i++) {
        console.log(`processing the ${i + 1} transfer`);
        const emp = employees[i];
        setCurrentIndex(i);
        setLoadingStep("deposit");

        const calls = await sdk.generate_approve_and_deposit_calls(
          parseAmountToWei(emp.salary),
          STRK_ADDR
        );
        const multiCall = await account.execute(calls);
        await account.waitForTransaction(multiCall.transaction_hash);
        await sdk.download_notes(multiCall.transaction_hash);

        setLoadingStep("withdraw");
        await sdk.withdraw(multiCall.transaction_hash, [emp.address]);
        console.log("withdraw worked");
      }

      setLoadingStep(null);
      setCompleted(true);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingStep(null);
    }
  };

  const totalAmount = employees.reduce((sum, e) => sum + e.salary, 0);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Distribute Payroll</h1>

      {employees.length === 0 && (
        <>
          <p className="mb-5">
            No employees to process. Create add an employee
          </p>
          <Link
            href="/employees"
            className="mt-3 px-4 py-2 bg-black w-[150px] cursor-pointer text-white rounded"
          >
            Create Employee
          </Link>
        </>
      )}

      {employees.length > 0 && !completed && (
        <>
          <DistributionProgress
            current={currentIndex}
            total={employees.length}
          />
          {loadingStep === "deposit" && (
            <DepositStep
              first_name={employees[currentIndex].first_name}
              last_name={employees[currentIndex].last_name}
              employeeAddress={employees[currentIndex].address}
              amount={employees[currentIndex].salary}
              loading
            />
          )}
          {loadingStep === "withdraw" && (
            <WithdrawStep
              employeeAddress={employees[currentIndex].address}
              amount={employees[currentIndex].salary}
              loading
            />
          )}
          <button
            onClick={handleDistribute}
            disabled={loadingStep === "deposit" || loadingStep === "withdraw"}
            className="bg-black text-white px-4 py-2 rounded mt-4 disabled:cursor-not-allowed disabled:opacity-65"
          >
            Start Distribution
          </button>
        </>
      )}

      {completed && (
        <SuccessSummary
          totalEmployees={employees.length}
          totalAmount={totalAmount}
        />
      )}
    </div>
  );
};

export default DistributePage;
