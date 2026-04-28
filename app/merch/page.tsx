import type { Metadata } from "next";
import { ShoppingBag } from "lucide-react";
import { Ascii, fonts } from "better-ascii";
import { FluidMap } from "@/registry/default/fluid-map/fluid-map";
import { BackButton } from "@/components/back-button";

export const metadata: Metadata = {
  title: "Merch",
  description: "Dev-flavored wearables. Dropping soon.",
};

const PRODUCTS = [
  { codename: "DROP_001", label: "The Debug Hoodie" },
  { codename: "DROP_002", label: "404 Not Found Tee" },
  { codename: "DROP_003", label: "console.log() Mug" },
];

export default function MerchPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8">
      <div className="mb-8 text-center">
        <Ascii
          font={fonts.deltaCorpsPriest1}
          className="text-[4px] leading-[1.15] text-center tracking-tight whitespace-pre"
        >
          Merch
        </Ascii>
        <p className="mt-2 text-neutral-600 text-sm">
          Dev-flavored wearables. Dropping soon.
        </p>
        <BackButton href="/" className="mt-4" />
      </div>

      <div className="w-full max-w-4xl relative">
        <FluidMap
          markers={[{ lat: 7.9465, lng: -1.0232, size: 0.8, pulse: true }]}
          markerColor="oklch(62.7% 0.265 303.9)"
          dotRadius={0.15}
          className="opacity-30"
          fluidStrength={3.5}
          fluidRadius={8}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-6 sm:gap-10">
            {PRODUCTS.map((product) => (
              <div key={product.codename} className="flex flex-col items-center gap-3">
                {/* Ghost product card */}
                <div className="size-24 sm:size-32 rounded-lg border border-neutral-800 bg-neutral-950/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2 animate-pulse">
                  <ShoppingBag
                    size={20}
                    strokeWidth={1}
                    className="text-neutral-700"
                  />
                  <span className="text-[9px] tracking-widest uppercase text-neutral-800 font-mono">
                    {product.codename}
                  </span>
                </div>

                {/* Redacted name */}
                <div className="text-center space-y-1.5">
                  <p className="text-[10px] text-neutral-700 font-mono tracking-wide blur-[3px] select-none">
                    {product.label}
                  </p>
                  <span className="inline-block text-[9px] tracking-widest uppercase text-neutral-700 border border-neutral-800 rounded px-1.5 py-0.5">
                    soon
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
