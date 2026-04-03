import type { CraftComponentMeta } from "@/lib/craft/types";

export const meta: CraftComponentMeta = {
  slug: "fluid-map",
  title: "Fluid Map",
  description:
    "A dotted world map with clockwise swirl physics on mouse interaction. Dots animate with spring-damping and settle like dust.",
  tags: ["SVG", "rAF", "Spring Physics"],
  registryId: "@dziedzorm/fluid-map",
  x: "25%",
  y: "35%",
  examples: [
    {
      title: "Basic usage",
      language: "tsx",
      code: `import { FluidMap } from "@/components/fluid-map"

export function Demo() {
  return <FluidMap />
}`,
    },
    {
      title: "With a location marker",
      language: "tsx",
      code: `import { FluidMap } from "@/components/fluid-map"

export function Demo() {
  return (
    <FluidMap
      markers={[{ lat: 7.9465, lng: -1.0232, size: 0.8, pulse: true }]}
      markerColor="oklch(62.7% 0.265 303.9)"
    />
  )
}`,
    },
    {
      title: "Custom dot color & opacity",
      language: "tsx",
      code: `import { FluidMap } from "@/components/fluid-map"

export function Demo() {
  return (
    <FluidMap
      dotColor="currentColor"
      dotRadius={0.15}
      className="opacity-50 text-neutral-500"
    />
  )
}`,
    },
    {
      title: "Disable fluid physics",
      language: "tsx",
      code: `import { FluidMap } from "@/components/fluid-map"

export function Demo() {
  return <FluidMap fluid={false} />
}`,
    },
  ],
};
