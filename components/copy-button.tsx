"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      onClick={copy}
      aria-label="Copy"
      className="size-6 rounded border border-neutral-700 flex items-center justify-center text-neutral-500 hover:text-neutral-200 hover:border-[oklch(62.7%_0.265_303.9)] hover:[box-shadow:0_0_8px_oklch(62.7%_0.265_303.9)] transition-all duration-300 overflow-hidden"
    >
      <span className="relative size-3 flex items-center justify-center">
        <Copy
          size={11}
          strokeWidth={1.5}
          className={`absolute transition-all duration-200 ${
            copied ? "opacity-0 scale-50" : "opacity-100 scale-100"
          }`}
        />
        <Check
          size={11}
          strokeWidth={2}
          className={`absolute transition-all duration-200 ${
            copied ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
        />
      </span>
    </button>
  );
}
