import { MapPin } from "lucide-react";
import { Ascii } from "better-ascii";
import { FluidMap } from "@/registry/default/fluid-map/fluid-map";
import { BackButton } from "@/components/back-button";

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8">
      <div className="mb-8 text-center">
        <Ascii className="text-[4px] leading-[1.15] tracking-tight whitespace-pre">
          Page Not Found
        </Ascii>

        <p className="mt-3 text-neutral-400 text-sm">Terra incognita.</p>
        <p className="mt-1 text-neutral-600 text-xs max-w-xs mx-auto">
          You&apos;ve wandered off the map. These coordinates lead nowhere in
          the known world.
        </p>

        <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-neutral-600 border border-neutral-800 rounded-md px-2.5 py-1">
          <MapPin size={10} className="text-[oklch(62.7%_0.265_303.9)]" />
          <span>0°N, 160°W — uncharted</span>
        </div>

        <div className="mt-5">
          <BackButton href="/" label="return to known world" />
        </div>
      </div>

      <div className="w-full max-w-5xl relative">
        <FluidMap
          markers={[{ lat: 0, lng: -160, size: 0.6, pulse: true }]}
          markerColor="oklch(62.7% 0.265 303.9)"
          dotRadius={0.15}
          className="opacity-25"
          fluidStrength={3.5}
          fluidRadius={8}
        />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="text-[10px] tracking-[0.4em] uppercase text-neutral-800 font-mono">
            Hic svnt dracones
          </span>
        </div>
      </div>
    </main>
  );
}
