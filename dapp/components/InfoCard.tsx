import React from "react";

interface InfoCardProps {
  title: string;
  description: string;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  description,
  className = "",
}) => {
  return (
    <div className={`border rounded-lg p-4 shadow-sm bg-white ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-600 mt-1">{description}</p>
    </div>
  );
};

export default InfoCard;
