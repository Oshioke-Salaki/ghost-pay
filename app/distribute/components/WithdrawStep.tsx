import React from "react";
import LoadingIndicator from "@/components/LoadingIndicator";

interface WithdrawStepProps {
  employeeAddress: string;
  amount: number;
  loading: boolean;
}

const WithdrawStep: React.FC<WithdrawStepProps> = ({
  employeeAddress,
  amount,
  loading,
}) => {
  return (
    <div className="border p-4 rounded mb-2 bg-gray-50">
      <p className="font-medium">Withdrawing to: {employeeAddress}</p>
      <p>Amount: {amount}</p>
      {loading && <LoadingIndicator message="Processing withdrawal..." />}
    </div>
  );
};

export default WithdrawStep;
