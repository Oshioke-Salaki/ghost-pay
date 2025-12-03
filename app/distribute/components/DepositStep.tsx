import React from "react";
import LoadingIndicator from "@/components/LoadingIndicator";

interface DepositStepProps {
  employeeAddress: string;
  amount: number;
  loading: boolean;
}

const DepositStep: React.FC<DepositStepProps> = ({
  employeeAddress,
  amount,
  loading,
}) => {
  return (
    <div className="border p-4 rounded mb-2 bg-gray-50">
      <p className="font-medium">Depositing to: {employeeAddress}</p>
      <p>Amount: {amount}</p>
      {loading && <LoadingIndicator message="Processing deposit..." />}
    </div>
  );
};

export default DepositStep;
