# Contributing a Craft Component

Craft components live in `registry/default/`. Each component gets its own folder with three files.

## Folder Structure

```
registry/default/your-component/
  your-component.tsx            # The component source (distributed via shadcn)
  your-component.preview.tsx    # Live preview shown on /craft/your-component
  your-component.meta.ts        # Metadata: title, description, tags, examples
```

## Step-by-Step

### 1. Create your component folder

```
registry/default/particle-field/
  particle-field.tsx
  particle-field.preview.tsx
  particle-field.meta.ts
```

**`particle-field.tsx`** — Your component. Must be self-contained (`"use client"` if needed). Use named + default export.

**`particle-field.meta.ts`** — Metadata:

```ts
import type { CraftComponentMeta } from "@/lib/craft/types";

export const meta: CraftComponentMeta = {
  slug: "particle-field",
  title: "Particle Field",
  description: "A brief description of what the component does.",
  tags: ["Canvas", "Animation"],
  registryId: "@dziedzorm/particle-field",
  x: "50%",   // horizontal position on the craft map
  y: "40%",   // vertical position on the craft map
  examples: [
    {
      title: "Basic usage",
      language: "tsx",
      code: `import { ParticleField } from "@/components/particle-field"

export function Demo() {
  return <ParticleField />
}`,
    },
  ],
};
```

**`particle-field.preview.tsx`** — Preview component:

```tsx
"use client";

import { ParticleField } from "./particle-field";

export function ParticleFieldPreview() {
  return <ParticleField /* props for a nice demo */ />;
}
```

### 2. Register it

Add exports to **`registry/default/index.ts`**:

```ts
export { meta as particleFieldMeta } from "./particle-field/particle-field.meta";
export { ParticleFieldPreview } from "./particle-field/particle-field.preview";
```

Add the meta to **`lib/craft/components.ts`**:

```ts
import { fluidMapMeta, particleFieldMeta } from "@/registry/default";

export const CRAFT_COMPONENTS: CraftComponentMeta[] = [fluidMapMeta, particleFieldMeta];
```

Add the preview to **`app/craft/[slug]/page.tsx`** in the `PREVIEWS` record:

```ts
import { FluidMapPreview, ParticleFieldPreview } from "@/registry/default";

const PREVIEWS: Record<string, Record<string, React.ReactNode>> = {
  "fluid-map": { default: <FluidMapPreview /> },
  "particle-field": { default: <ParticleFieldPreview /> },
};
```

### 3. Add to registry.json

```json
{
  "name": "particle-field",
  "type": "registry:component",
  "title": "Particle Field",
  "description": "A brief description.",
  "dependencies": [],
  "files": [
    {
      "path": "registry/default/particle-field/particle-field.tsx",
      "type": "registry:component"
    }
  ]
}
```

### 4. Build and verify

```bash
bun run registry:build
bun dev
```

Visit `/craft` and `/craft/particle-field` to confirm everything works.

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Folder | `kebab-case` matching slug | `fluid-map/` |
| Component file | `{slug}.tsx` | `fluid-map.tsx` |
| Meta file | `{slug}.meta.ts` | `fluid-map.meta.ts` |
| Preview file | `{slug}.preview.tsx` | `fluid-map.preview.tsx` |
| Component export | PascalCase | `FluidMap` |
| Preview export | `{PascalCase}Preview` | `FluidMapPreview` |

## What Goes Where

| Path | Purpose |
|------|---------|
| `registry/default/` | Craft components (distributed via shadcn registry) |
| `components/` | Site-only components (footer, navigation, overlays) |
| `components/ui/` | shadcn primitives used by the site |
