"use client";

import Link from "next/link";
import type { Doc } from "@/lib/journal/types";

export function JournalOverlay({ docs, className }: { docs: Doc[]; className?: string }) {
  return (
    <div className={className ?? "absolute inset-0 flex items-start justify-center pt-[5%]"}>
      <div className="flex flex-col gap-3 w-full px-4 md:w-auto md:px-0">
        {docs.map((doc, i) => (
          <Link
            key={doc.slug}
            href={`/journal/${doc.slug}`}
            className="group relative flex flex-wrap items-center gap-x-3 gap-y-0.5 md:inline-flex md:flex-nowrap md:whitespace-nowrap md:w-fit text-base text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <span className="text-xs text-neutral-600 shrink-0">{String(i + 1).padStart(2, "0")}</span>
            <span className="shrink-0 md:contents">{doc.metadata.title}</span>
            <span className="text-xs text-neutral-600 font-mono shrink-0">
              {new Date(doc.metadata.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <span className="absolute -bottom-px left-0 h-px w-0 group-hover:w-full transition-all duration-300 bg-[oklch(62.7%_0.265_303.9)]" />
          </Link>
        ))}
      </div>
    </div>
  );
}
