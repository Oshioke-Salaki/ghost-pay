"use client";
import { useUIStore } from "@/store/uiStore";
import { Eye, Shield } from "lucide-react";

function ToggleAmountsDisplay() {
  const hideAmounts = useUIStore((s) => s.hideAmounts);
  const toggle = useUIStore((s) => s.toggleHideAmounts);

  return (
    <button
      onClick={toggle}
      className={`
        flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all border
        ${
          hideAmounts
            ? "bg-gray-900 text-white border-black hover:bg-gray-800" // Active (Privacy On)
            : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-black" // Inactive
        }
      `}
    >
      {hideAmounts ? (
        <>
          <Shield size={12} /> Privacy On
        </>
      ) : (
        <>
          <Eye size={14} /> Show Balances
        </>
      )}
    </button>
  );
}

export default ToggleAmountsDisplay;
