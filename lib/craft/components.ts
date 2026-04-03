import type { CraftComponentMeta } from "./types";
import { fluidMapMeta } from "@/registry/default";

export type { CraftComponentMeta };

export const CRAFT_COMPONENTS: CraftComponentMeta[] = [fluidMapMeta];

export function getCraftComponent(slug: string) {
  return CRAFT_COMPONENTS.find((c) => c.slug === slug) ?? null;
}
