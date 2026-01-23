"use client";
import React, { useState, useRef, useEffect } from "react";
import { useViewModeStore } from "@/store/viewModeStore";
import { Building2, ChevronDown, Check, User } from "lucide-react";

export default function ModeSwitcher() {
  const { mode, setMode } = useViewModeStore();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close dropdown on outside click
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitch = (newMode: "organization" | "personal") => {
    setMode(newMode);
    setIsOpen(false);
  };

  const currentIcon = mode === "organization" ? <Building2 size={16} /> : <User size={16} />;
  const currentLabel = mode === "organization" ? "Organization HQ" : "Personal HQ";

  return (
    <div className="px-4 py-2" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
      >
        <div className="flex items-center gap-2 font-medium text-sm text-gray-900">
          <div className="bg-gray-100 p-1.5 rounded-md text-gray-700">
            {currentIcon}
          </div>
          {currentLabel}
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-4 right-4 mt-1 bg-white border border-gray-200 shadow-lg rounded-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-1">
            <button
              onClick={() => handleSwitch("organization")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                mode === "organization"
                  ? "bg-gray-50 text-black font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-black"
              }`}
            >
              <div className="flex items-center gap-2">
                <Building2 size={16} />
                Organization HQ
              </div>
              {mode === "organization" && <Check size={16} />}
            </button>
            <button
              onClick={() => handleSwitch("personal")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                mode === "personal"
                  ? "bg-gray-50 text-black font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-black"
              }`}
            >
              <div className="flex items-center gap-2">
                <User size={16} />
                Personal HQ
              </div>
              {mode === "personal" && <Check size={16} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
