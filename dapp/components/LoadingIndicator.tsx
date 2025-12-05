import { Loader2 } from "lucide-react";
import React from "react";

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = "Loading...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Loader2
        size={50}
        className="animate-spin text-[#c4c4c4]"
        strokeWidth={2}
      />
      <p className="mt-2 text-gray-700">{message}</p>
    </div>
  );
};

export default LoadingIndicator;
