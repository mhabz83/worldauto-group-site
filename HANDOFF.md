# World Automotive Group website — developer handoff

## What this is
The corporate marketing site for World Automotive Group (worldauto.group). The signature element is a real-time WebGL hero background: glowing "light-trail" line-strands that morph between scenes and react to scroll. It is live 3D in the browser, not a video.

## Tech stack
- **Next.js 16.2.10** (App Router, Turbopack)
- **React 19** + **TypeScript**
- **Tailwind CSS v4** (`@theme inline`, tokens in `app/tokens.css`)
- **Three.js 0.185** for the WebGL hero (`EffectComposer`, `UnrealBloomPass`, `LineSegments`)
- Fonts: Suisse Intl (local, `app/fonts/`)
- Intended host: **Vercel**

## Run locally
```bash
npm install      # if node_modules is missing
npm run dev      # http://localhost:3000
```
Scripts: `dev`, `build`, `start`, `lint`.

> Gotcha: this folder currently lives in OneDrive, and OneDrive corrupts `node_modules`
> (intermittent "os error 60"). Clone the GitHub repo to a normal local folder, or keep
> `node_modules` outside the synced folder. This is a local-environment issue only, not a code issue.

## Key files
- `app/page.tsx` — the homepage (all sections)
- `components/hero/NeonJourney.tsx` — **the WebGL hero** (the specialized part)
- `content/home.ts`, `content/site.ts` — **all copy and data live here** (single source of truth)
- `app/tokens.css` — design tokens (color, type, spacing); `app/globals.css` maps them to Tailwind
- `components/blocks/*`, `components/primitives/*` — the reusable component library
- `app/styleguide/page.tsx` — component/style reference; `app/variants/page.tsx` — earlier hero explorations
- `components/hero/MadarHero.tsx` — an earlier hero, **not used**, safe to ignore or delete

## What is DONE
- Homepage: hero, the four companies, the operating model / pillars, group numbers, heritage timeline, partner/contact band
- Real WAG content wired through `content/`
- WebGL neon hero with scroll-driven morph and bloom
- Shared design system (tokens + component library) and a styleguide page

## What "complete the build" means (remaining scope)
1. **Responsive pass** — phone and tablet layouts; check WebGL performance on mobile and add a lightweight fallback (static image or reduced particles) for weak GPUs and `prefers-reduced-motion`.
2. **Inner pages** — company detail pages, an About / Group page (leadership), and a Contact page with a working form.
3. **Wire the actions** — the "Partner With Us" button and contact form are inert; connect to an email or form backend.
4. **Fill placeholders** — see `PLACEHOLDERS.md` (contact email, legal entity name, leadership list, final pillar copy, milestones).
5. **Production hardening** — accessibility (WCAG), SEO metadata, social/OG images, sitemap/robots, cross-browser testing, Lighthouse pass.
6. **Deploy** — ship to Vercel and connect the `worldauto.group` domain.

## Hard content rules (do not break)
- Use only verified facts already in `content/`. Do not invent clients, numbers, awards, logos, or history.
- Never reference any pending deal or partner that is not already public in the content files.
