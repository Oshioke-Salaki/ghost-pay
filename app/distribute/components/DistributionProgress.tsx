import React from "react";

interface DistributionProgressProps {
  current: number;
  total: number;
}

const DistributionProgress: React.FC<DistributionProgressProps> = ({
  current,
  total,
}) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  return (
    <div className="w-full mb-4">
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-green-500 h-4 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-gray-700 mt-1">
        {current} of {total} employees processed ({percentage.toFixed(0)}%)
      </p>
    </div>
  );
};

export default DistributionProgress;
