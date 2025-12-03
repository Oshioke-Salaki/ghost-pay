import React from "react";

interface AlertBannerProps {
  message: string;
  type?: "success" | "error" | "info";
}

const AlertBanner: React.FC<AlertBannerProps> = ({
  message,
  type = "info",
}) => {
  let bgColor = "bg-blue-100 text-blue-800";
  if (type === "success") bgColor = "bg-green-100 text-green-800";
  if (type === "error") bgColor = "bg-red-100 text-red-800";

  return (
    <div className={`${bgColor} border border-current rounded p-3 mb-4`}>
      {message}
    </div>
  );
};

export default AlertBanner;
