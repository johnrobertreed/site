# John Robert Reed

Personal website for John Robert ("JR") Reed — Partner & CMO at Multicoin Capital.

A quiet, left-aligned single page: a cursor-follow portrait, expanding About / Career / Advisory / Bookshelf drawers, a 3D shelf with a list fallback, and a "How I can help" overlay. Built to be fast, accessible, and easy to deploy. There is no visitor analytics or tracking.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4
- Google Fonts: Fraunces (display), Instrument Sans (body), IBM Plex Mono (labels and dates)
- Three.js (interactive bookshelf, loaded when that drawer opens)

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build
npm start
```

`next build` produces a standard Next.js production build (not a forced static export). Deploy as a normal Next.js app on Vercel or any Node host.

## Design credit

Site design inspired by [Ahmed Dahbi](https://dahbiahmed.com/). The layout system, type pairing, career-row pattern, and help overlay are the reference — none of his copy, photos, books, or projects are used.

## Content notes

Career entries are limited to roles JR provided. Uncertain or scraped items (Hotmail, GamePlan, internships) are omitted. There is no side-projects section. The bookshelf is a starter placeholder list, not a claim about what JR has read. The Whiskey For Water board seat is listed without a URL because the old domain could not be verified as live.
