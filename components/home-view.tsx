"use client";

import { useState } from "react";
import { KennedyAnyidoho } from "@/components/kennedy-anyidoho";
import { MapLinksOverlay } from "@/components/map-links";
import { JournalOverlay } from "@/components/journal-overlay";
import { DottedMap } from "@/components/ui/dotted-map";
import { Footer } from "@/components/footer";
import { ArrowLeft } from "lucide-react";
import { Ascii, fonts } from "better-ascii";
import type { Doc } from "@/lib/journal/types";

type View = "home" | "journal";

export function HomeView({ docs }: { docs: Doc[] }) {
  const [view, setView] = useState<View>("home");

  const isHome = view === "home";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8 relative">
      {/* Hero — animates between name and journal heading */}
      <div className="mb-8 relative w-full max-w-4xl flex justify-center">
        <div
          className={`transition-all duration-500 text-center ${
            isHome
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-3 pointer-events-none absolute"
          }`}
        >
          <KennedyAnyidoho />
        </div>

        <div
          className={`transition-all duration-500 text-center ${
            !isHome
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-3 pointer-events-none absolute"
          }`}
        >
          <Ascii
            font={fonts.deltaCorpsPriest1}
            className="text-[4px] leading-[1.15] text-center tracking-tight whitespace-pre"
          >
            Journal
          </Ascii>
          <p className="mt-2 max-w-lg text-neutral-600 text-center">
            Thoughts, technical notes, and things I find interesting.
          </p>
          <button
            onClick={() => setView("home")}
            className="mt-4 inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-200 transition-colors text-sm"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            back
          </button>
        </div>
      </div>

      {/* Map — persistent background with swappable overlay */}
      <div className="w-full max-w-4xl relative">
        <DottedMap
          markers={[{ lat: 7.9465, lng: -1.0232, size: 0.8, pulse: true }]}
          markerColor="oklch(62.7% 0.265 303.9)"
          dotRadius={0.15}
          className="opacity-50"
        />

        {/* Home links overlay */}
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            isHome
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <MapLinksOverlay onJournalClick={() => setView("journal")} />
        </div>

        {/* Journal overlay */}
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            !isHome
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <JournalOverlay docs={docs} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <Footer />
      </div>
    </main>
  );
}
