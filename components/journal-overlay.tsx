"use client";

import Link from "next/link";
import type { Doc } from "@/lib/journal/types";

export function JournalOverlay({ docs }: { docs: Doc[] }) {
  return (
    <div className="absolute inset-0 flex items-start justify-center pt-[5%]">
      <div className="flex flex-col gap-3">
        {docs.map((doc, i) => (
          <Link
            key={doc.slug}
            href={`/journal/${doc.slug}`}
            className="group relative inline-flex items-center gap-3 text-base text-neutral-400 hover:text-neutral-200 transition-colors whitespace-nowrap w-fit"
          >
            <span className="text-xs text-neutral-600">{String(i + 1).padStart(2, "0")}</span>
            {doc.metadata.title}
            <span className="text-xs text-neutral-600 font-mono">
              {new Date(doc.metadata.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <span className="absolute -bottom-px left-0 h-px w-0 group-hover:w-full transition-all duration-300 bg-[oklch(62.7%_0.265_303.9)]" />
          </Link>
        ))}
      </div>
    </div>
  );
}
