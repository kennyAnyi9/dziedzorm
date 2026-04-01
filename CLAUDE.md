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

This is a minimal Next.js 16 personal portfolio (App Router) for Kennedy Anyidoho.

**Key paths:**
- `app/` — Next.js App Router (layout, page, global CSS)
- `components/` — Two main components: hero section and links
- `lib/` — Sound engine, type definitions, and `cn()` utility
- `hooks/` — `useSound` hook for audio playback

**Sound system** (`lib/sound-engine.ts` → `hooks/use-sound.ts`):
- Custom Web Audio API wrapper with singleton `AudioContext`, buffer caching, and base64 audio asset embedding
- Hook returns `[play, { stop, pause, isPlaying, duration }]`
- Sound assets are embedded as base64 data URIs in `lib/*.ts` files (no external audio files)

**Styling:**
- Tailwind CSS v4 with OKLch theme variables defined in `app/globals.css`
- Shadcn/ui with `base-lyra` preset (`components.json`), Phosphor icons
- Path alias `@/*` maps to project root

**Component notes:**
- `components/kennedy-anyidoho.tsx` — ASCII art header using `better-ascii-react` (`deltaCorpsPriest1` font, `text-[4px]` sizing)
- `components/links.tsx` — Client component; plays `bookFlip3Sound` via `useSound` on interactions
