import React from "react";
import LoadingIndicator from "@/components/LoadingIndicator";

interface DepositStepProps {
  first_name: string;
  last_name: string;
  employeeAddress: string;
  amount: number;
  loading: boolean;
}

const DepositStep: React.FC<DepositStepProps> = ({
  first_name,
  last_name,
  employeeAddress,
  amount,
  loading,
}) => {
  return (
    <div className="border p-4 rounded mb-2 bg-gray-50">
      <p className="">
        Depositing to:{" "}
        <span className="font-medium text-lg">
          {first_name} {last_name}
        </span>
      </p>
      <p>
        Address: <span className="font-medium text-lg">{employeeAddress}</span>
      </p>
      <p className="text-base">
        Amount: <span className="font-medium text-lg">{amount} STRK</span>
      </p>
      {loading && <LoadingIndicator message="Processing deposit..." />}
    </div>
  );
};

export default DepositStep;
