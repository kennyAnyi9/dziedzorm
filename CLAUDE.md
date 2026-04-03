# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev      # Start development server (http://localhost:3000)
bun build    # Production build
bun start    # Start production server
bun lint     # Run ESLint
```

Use **Bun** as the package manager (bun.lock is present).

## Architecture

Next.js 16 personal portfolio (App Router) for Kennedy Anyidoho.

**Key paths:**
- `app/` — App Router: `layout.tsx`, `page.tsx`, `globals.css`, plus `journal/[slug]/` and `shipped/` routes
- `components/` — UI components; `components/ui/` for base primitives (dotted-map)
- `lib/journal/` — File-based MDX blog: `documents.ts` (server-only), `types.ts`, `content/*.mdx`
- `hooks/` — `useSound` hook for Web Audio API playback
- `lib/*.ts` — Sound assets embedded as base64 data URIs; `cn()` utility in `lib/utils.ts`

**Page structure (`app/page.tsx`):**
- Server component — fetches all journal docs via `getAllDocs()` and passes to `HomeView`
- `HomeView` (client) owns a `view: "home" | "journal"` state and cross-fades between two overlays over a persistent `DottedMap`
- **Home overlay**: `MapLinksOverlay` — links positioned absolutely over the map using `left`/`top` percentages
- **Journal overlay**: `JournalOverlay` — numbered post list centered on the map
- Hero area animates between ASCII name (`KennedyAnyidoho`) and ASCII "Journal" heading

**DottedMap animation (`components/ui/dotted-map.tsx`):**
- ~5000 SVG `<circle>` elements with `data-ox`/`data-oy` for rest-position cache
- `requestAnimationFrame` loop using `Float32Array` for `dx/dy/vx/vy` — direct DOM `setAttribute` bypasses React re-renders
- Mouse enters active set; force is clockwise tangential `(distY/dist, -distX/dist)` + small radial push; spring + damping returns dots to rest
- `SPRING=0.05`, `DAMPING=0.78`; scan radius is `R * 1.5`
- Props: `repel` (default true), `repelRadius` (default 8), `repelStrength` (default 0.4)

**Journal (`lib/journal/`):**
- `getAllDocs()` uses `React.cache()`, reads MDX from `lib/journal/content/`, sorts pinned-first then by `createdAt` desc
- Frontmatter shape: `title`, `description`, `createdAt`, `updatedAt`, `pinned?`, `category?`, `new?`
- Individual post pages at `app/journal/[slug]/page.tsx` use `force-static` + `generateStaticParams`

**Styling:**
- Tailwind CSS v4 — use `@plugin` syntax (not `@import`) for plugins in `globals.css`
- Accent color throughout: `oklch(62.7% 0.265 303.9)` (purple) — used for glows, underlines, icon borders, map marker
- Liquid glass effect: hidden SVG filters in `LiquidGlassFilters` + `.liquid-glass` / `.liquid-glass-item` CSS classes in `globals.css`
- `ThoughtBubble` — liquid glass tooltip shown on `group-hover`, with three-dot thought trail
- Shadcn/ui `base-lyra` preset; JetBrains Mono throughout

**Sound system:**
- `lib/sound-engine.ts` → `hooks/use-sound.ts`; assets are base64 data URIs in `lib/*.ts`
- `ctx.resume().then(startPlayback)` pattern required for browser autoplay policy
