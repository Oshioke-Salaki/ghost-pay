import React, { ReactNode } from "react";

type AssetCardProps = {
  title: string;
  currency: string;
  balance: string | number;
  icon: ReactNode;
  actions: ReactNode;
  variant?: "light" | "dark";
};

export default function AssetCard({
  title,
  currency,
  balance,
  icon,
  actions,
  variant = "light",
}: AssetCardProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={`relative rounded-3xl p-8 transition-all overflow-hidden border ${
        isDark
          ? "bg-black text-white border-gray-800"
          : "bg-white text-black border-gray-200"
      }`}
    >
      <div className="flex justify-between items-start mb-6 z-10 relative">
        <div className="flex flex-col">
          <p
            className={`text-sm font-bold uppercase tracking-wider mb-2 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold tracking-tighter">
              {balance}
            </span>
            <span
              className={`text-xl font-medium ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {currency}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute right-[-20px] bottom-[-20px] opacity-5 pointer-events-none">
          {/* Render icon if simple element */}
          <div className="scale-150 transform rotate-12">{icon}</div>
      </div>

      <div className="relative z-10 pt-4 border-t border-dashed border-opacity-20 mt-4 border-gray-500">
        {actions}
      </div>
    </div>
  );
}
