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
  props: [
    {
      name: "markers",
      type: "Marker[]",
      default: "[]",
      description: "Array of lat/lng pins to render on the map. Each marker accepts lat, lng, size, and pulse.",
    },
    {
      name: "markerColor",
      type: "string",
      default: '"#FF6900"',
      description: "Fill color for all markers and their pulse rings.",
    },
    {
      name: "dotColor",
      type: "string",
      default: '"currentColor"',
      description: "Fill color for the map dots. Inherits from CSS color by default.",
    },
    {
      name: "dotRadius",
      type: "number",
      default: "0.2",
      description: "Radius of each dot in SVG coordinate units.",
    },
    {
      name: "fluid",
      type: "boolean",
      default: "true",
      description: "Enable repulsion physics on mouse interaction. Set to false for a static map.",
    },
    {
      name: "fluidRadius",
      type: "number",
      default: "20",
      description: "Radius of the cursor influence area in SVG units. Larger values affect more dots.",
    },
    {
      name: "fluidStrength",
      type: "number",
      default: "0.4",
      description: "Strength of the repulsion force applied to dots within the influence radius.",
    },
    {
      name: "pulse",
      type: "boolean",
      default: "false",
      description: "Force all markers to display a pulse ring, overriding per-marker pulse settings.",
    },
    {
      name: "stagger",
      type: "boolean",
      default: "true",
      description: "Offset odd rows by half a step to produce a natural hex-grid dot pattern.",
    },
    {
      name: "mapSamples",
      type: "number",
      default: "5000",
      description: "Total number of dots sampled to fill the map outline.",
    },
    {
      name: "width",
      type: "number",
      default: "150",
      description: "SVG coordinate width. Increase for more horizontal resolution.",
    },
    {
      name: "height",
      type: "number",
      default: "75",
      description: "SVG coordinate height. Increase for more vertical resolution.",
    },
    {
      name: "renderMarkerOverlay",
      type: "(args: { marker, index, x, y, r }) => ReactNode",
      default: "undefined",
      description: "Render custom SVG elements at each marker position. Receives computed x/y and radius.",
    },
  ],
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
