import React from "react";

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = "Loading...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      <p className="mt-2 text-gray-700">{message}</p>
    </div>
  );
};

export default LoadingIndicator;
