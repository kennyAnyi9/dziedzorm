import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Ascii, fonts } from "better-ascii";
import { FluidMap } from "@/registry/default/fluid-map/fluid-map";
import { CRAFT_COMPONENTS } from "@/lib/craft/components";

export const metadata: Metadata = {
  title: "Craft",
  description: "Handcrafted components, free to use.",
};

export default function CraftPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8">
      {/* Hero */}
      <div className="mb-8 text-center">
        <Ascii
          font={fonts.deltaCorpsPriest1}
          className="text-[4px] leading-[1.15] text-center tracking-tight whitespace-pre"
        >
          Craft
        </Ascii>
        <p className="mt-2 text-neutral-600 text-sm">
          Handcrafted components. Copy, install, use freely.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-200 transition-colors text-sm"
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          back
        </Link>
      </div>

      {/* Map with component links */}
      <div className="w-full max-w-4xl relative">
        <FluidMap
          markers={[{ lat: 7.9465, lng: -1.0232, size: 0.8, pulse: true }]}
          markerColor="oklch(62.7% 0.265 303.9)"
          dotRadius={0.15}
          className="opacity-50"
        />

        <div className="absolute inset-0">
          {CRAFT_COMPONENTS.map((component) => (
            <Link
              key={component.slug}
              href={`/craft/${component.slug}`}
              className="group absolute inline-flex items-center gap-1 text-base text-neutral-400 hover:text-neutral-200 transition-colors whitespace-nowrap"
              style={{ left: component.x, top: component.y }}
            >
              <span className="relative">
                {component.title}
                <span className="absolute -bottom-px left-0 h-px w-0 group-hover:w-full transition-all duration-300 bg-[oklch(62.7%_0.265_303.9)]" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
