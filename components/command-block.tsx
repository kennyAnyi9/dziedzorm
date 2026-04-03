"use client";

import { useState, useRef, useEffect } from "react";
import { Terminal } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

type PackageManager = "bun" | "npm" | "pnpm" | "yarn";

const PMS: PackageManager[] = ["bun", "npm", "pnpm", "yarn"];

function buildCommand(pm: PackageManager, registryId: string): string {
  switch (pm) {
    case "bun":  return `bunx --bun shadcn add ${registryId}`;
    case "npm":  return `npx shadcn@latest add ${registryId}`;
    case "pnpm": return `pnpm dlx shadcn@latest add ${registryId}`;
    case "yarn": return `yarn dlx shadcn@latest add ${registryId}`;
  }
}

export function CommandBlock({ registryId }: { registryId: string }) {
  const [pm, setPm] = useState<PackageManager>("bun");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const el = tabRefs.current[pm];
    if (el) {
      setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [pm]);

  // Set initial indicator position after mount
  useEffect(() => {
    const el = tabRefs.current["bun"];
    if (el) setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth });
  }, []);

  const command = buildCommand(pm, registryId);

  return (
    <div className="border border-neutral-800 rounded-lg overflow-hidden">
      {/* Tabs */}
      <div className="relative flex items-center border-b border-neutral-800 bg-neutral-950 px-3">
        {/* Sliding indicator */}
        <span
          className="absolute bottom-0 h-[1.5px] bg-[oklch(62.7%_0.265_303.9)] transition-all duration-200 ease-out"
          style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
        />
        {PMS.map((key) => (
          <button
            key={key}
            ref={(el) => { tabRefs.current[key] = el; }}
            onClick={() => setPm(key)}
            className={`px-3 py-2 text-xs transition-colors duration-200 ${
              pm === key ? "text-neutral-200" : "text-neutral-600 hover:text-neutral-400"
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Command */}
      <div className="flex items-center gap-3 bg-neutral-950 px-4 py-3">
        <Terminal size={13} strokeWidth={1.5} className="text-neutral-600 shrink-0" />
        <code
          key={pm}
          className="text-sm text-neutral-300 flex-1 truncate animate-in fade-in duration-150"
        >
          {command}
        </code>
        <CopyButton text={command} />
      </div>
    </div>
  );
}
