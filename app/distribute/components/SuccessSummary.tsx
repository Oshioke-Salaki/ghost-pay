import React from "react";

interface SuccessSummaryProps {
  totalEmployees: number;
  totalAmount: number;
}

const SuccessSummary: React.FC<SuccessSummaryProps> = ({
  totalEmployees,
  totalAmount,
}) => {
  return (
    <div className="border p-4 rounded bg-green-50 mt-4">
      <h2 className="text-lg font-semibold text-green-800 mb-2">
        Distribution Successful!
      </h2>
      <p>Total Employees Paid: {totalEmployees}</p>
      <p>Total Amount Distributed: {totalAmount}</p>
    </div>
  );
};

export default SuccessSummary;
