"use client";

import { FluidMap } from "@/registry/default/fluid-map/fluid-map";

export function FluidMapPreview() {
  return (
    <FluidMap
      markers={[{ lat: 7.9465, lng: -1.0232, size: 0.8, pulse: true }]}
      markerColor="oklch(62.7% 0.265 303.9)"
      dotRadius={0.15}
      dotColor="currentColor"
      className="opacity-60 text-neutral-700"
    />
  );
}
