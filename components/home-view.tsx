"use client";

import { useState } from "react";
import { KennedyAnyidoho } from "@/components/kennedy-anyidoho";
import { MapLinksOverlay, MapLinksMobile } from "@/components/map-links";
import { JournalOverlay } from "@/components/journal-overlay";
import { FluidMap } from "@/registry/default/fluid-map/fluid-map";
import { BackButton } from "@/components/back-button";
import { Ascii, fonts } from "better-ascii";
import type { Doc } from "@/lib/journal/types";
import { playSound } from "@/lib/sound-engine";
import { uChatScrollButtonSound } from "@/lib/u-chat-scroll-button";

type View = "home" | "journal";

export function HomeView({ docs }: { docs: Doc[] }) {
  const [view, setView] = useState<View>("home");

  const isHome = view === "home";

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 relative">
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
          <BackButton
            onClick={() => {
              playSound(uChatScrollButtonSound.dataUri, { volume: 0.8 });
              setView("home");
            }}
            className="mt-4"
          />
        </div>
      </div>

      {/* Mobile map (< md) — faded map + centered list overlay */}
      <div className="md:hidden w-full max-w-4xl relative">
        <FluidMap
          markers={[{ lat: 7.9465, lng: -1.0232, size: 0.8, pulse: true }]}
          markerColor="oklch(62.7% 0.265 303.9)"
          dotRadius={0.15}
          className="opacity-20"
          fluidStrength={3.5}
          fluidRadius={8}
        />
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
            isHome
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <MapLinksMobile
            onJournalClick={() => {
              playSound(uChatScrollButtonSound.dataUri, { volume: 0.8 });
              setView("journal");
            }}
          />
        </div>
        <JournalOverlay
          docs={docs}
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
            !isHome
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        />
      </div>

      {/* Desktop map (md+) — persistent background with swappable overlay */}
      <div className="hidden md:block w-full max-w-5xl relative">
        <FluidMap
          markers={[{ lat: 7.9465, lng: -1.0232, size: 0.8, pulse: true }]}
          markerColor="oklch(62.7% 0.265 303.9)"
          dotRadius={0.15}
          className="opacity-50"
          fluidStrength={3.5}
          fluidRadius={8}
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
    </main>
  );
}
