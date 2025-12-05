"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text: string; // what to copy
  size?: number; // icon size (optional)
  className?: string; // optional styling
}

export default function CopyButton({
  text,
  size = 18,
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1 cursor-pointer ${className}`}
    >
      {copied ? (
        <Check size={size} className="text-green-500" />
      ) : (
        <Copy size={size} />
      )}
    </button>
  );
}
