# CLAUDE.md

## Project Overview

Marketing website for **HardyGreens** — an AI platform for engineering non-GMO disease resistance in crops using PRRs (Pattern Recognition Receptors). Built at UC Berkeley / Innovative Genomics Institute.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Styling:** Tailwind CSS 4 (CSS-based config via `@theme` in globals.css)
- **Animation:** Framer Motion (scroll-triggered reveals, count-up animations)
- **Typography:** Instrument Serif (headings) + Geist (body) + Geist Mono (labels)
- **Language:** TypeScript (strict mode)
- **Deployment:** Vercel — https://something-better-website.vercel.app
- **Browser Testing:** Playwright (for agent-driven visual verification)

## Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint
node scripts/screenshot.js [url] [output-dir]  # Multi-viewport screenshots
```

## Design Philosophy

Editorial, research-institution aesthetic inspired by Isomorphic Labs, Arc Institute, and EvolutionaryScale. NOT a typical startup template.

Key principles:
- **Serif + sans-serif pairing** — Instrument Serif for headings, Geist for UI
- **Extreme whitespace** — 128-176px between major sections
- **Real science as visual design** — color-coded nucleotide sequence strip, publication reference
- **Restraint over decoration** — monochromatic palette + one green accent
- **Content-first** — lead with research, not marketing fluff
- **Left-aligned editorial layout** — not centered template style

## Color Palette

- Background: `#FAFAF8` (warm white)
- Alt surface: `#F3F1EC` (warm cream)
- Brand: `#2D6A4F` (forest green)
- Text: `#1A1A17` (warm black)
- Muted: `#6B6B63`
- Nucleotide bases: A=#2D6A4F, T=#B45309, C=#1D4ED8, G=#9333EA

## Agents

- `/ceo` — Messaging, positioning, investor readiness (Playwright screenshots)
- `/cto` — Code quality, performance, accessibility (Playwright + Lighthouse)
- `/design` — Visual design, typography, spacing, animation quality (Playwright multi-viewport)

## Parent Project

The startup's core codebase (pipeline, ML models, data) lives at `../something-better/`.
