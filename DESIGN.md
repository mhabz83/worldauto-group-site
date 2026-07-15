---
name: World Automotive Group
description: Cinematic institutional operator — near-black navy, a real-time neon field, one orange signal.
colors:
  page-navy: "#02040f"
  panel-navy: "#04061a"
  hero-navy: "#060a3d"
  mid-navy: "#172e64"
  signal-orange: "#ff6340"
  signal-orange-deep: "#fb441a"
  structure-blue: "#0b6fd8"
  structure-blue-hover: "#2e8fef"
  company-fasttrack: "#1367FE"
  company-autodata: "#42D7FF"
  company-axxion: "#FF4200"
  company-pag-direct: "#8A6CFF"
  company-vicimus: "#34E39B"
  ink: "#07090e"
  paper: "#ffffff"
typography:
  display:
    fontFamily: "Suisse Intl, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 8vw, 8.5rem)"
    fontWeight: 300
    lineHeight: 0.9
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Suisse Intl, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 4.5rem)"
    fontWeight: 300
    lineHeight: 1.02
  title:
    fontFamily: "Suisse Intl, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3.4vw, 3rem)"
    fontWeight: 300
    lineHeight: 1.02
  body:
    fontFamily: "Suisse Intl, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1rem, 1.1vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Suisse Intl, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    letterSpacing: "0.28em"
  mono:
    fontFamily: "ui-monospace, JetBrains Mono, SFMono-Regular, Menlo, monospace"
    fontSize: "0.66rem"
    fontWeight: 400
    letterSpacing: "0.14em"
rounded:
  sm: "4px"
  md: "12px"
  pill: "999px"
spacing:
  gutter: "clamp(1.25rem, 4vw, 4rem)"
components:
  button-primary:
    backgroundColor: "{colors.signal-orange}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.signal-orange-deep}"
    textColor: "{colors.paper}"
  input-field:
    backgroundColor: "{colors.page-navy}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
---

# Design System: World Automotive Group

## 1. Overview

**Creative North Star: "The Night Interchange"**

The whole system is a highway interchange at night, rendered in real time. A near-black navy ground, glowing light-trails that converge and morph as you move, and a single orange that reads like a signal, not a decoration. Automotive, run like infrastructure — so the interface is engineered, in motion, and unmistakably serious, the way a control room or a lit interchange is serious. Nothing here is retail, playful, or bought off a shelf.

The atmosphere is carried by a live WebGL line-field that sits behind every page and shifts with scroll. Content floats above it on flat surfaces, separated by thin hairlines and dark legibility scrims rather than boxes and shadows. Type is one family, Suisse Intl, worked through weight and case: a light, lowercase display that states rather than shouts. The result should feel institutional but never sterile — the seriousness of an operator, wrapped in cinematic light.

This system explicitly rejects four things, drawn straight from the brand's anti-references: generic corporate or consulting blandness (stock-photo grey), flashy consumer-startup energy (gradient-hero hype, playfulness, emoji), anything templated or off-the-shelf, and the retail look of a car dealership or showroom.

**Key Characteristics:**
- Near-black navy ground (`#02040f`) with a live WebGL neon field as the atmosphere
- A single orange signal (`#ff6340`), used on ≤10% of any screen
- Suisse Intl throughout; a light, lowercase display is the signature
- Flat surfaces — depth comes from light and hairlines, never drop shadows
- Expressive but disciplined motion; every animation has a reduced-motion path

## 2. Colors: The Night Interchange Palette

A palette of one deep navy ground, two accents with fixed jobs, and white worked through opacity — the color is the light against the dark.

### Primary
- **Signal Orange** (`#ff6340`): the one energy accent. Reserved for calls to action, the highlighted display word, active and hover states, and small labels and numbers. Its rarity is the point.
- **Signal Orange Deep** (`#fb441a`): the pressed / hover shade of the accent only.

### Secondary
- **Structure Blue** (`#0b6fd8`, hover `#2e8fef`): the structural accent — wayfinding kickers and links. Quieter than orange; it organizes rather than emphasizes.

### Neutral
- **Page Navy** (`#02040f`): the near-black navy ground, the base of every page.
- **Hero Navy** (`#060a3d`) and **Mid Navy** (`#172e64`): elevated tones and the deeper colors inside the neon field. These are Madar's signature navies, shared by design.
- **Paper** (`#ffffff`): high-contrast headings and key text. Body text is white at 82% opacity; supporting text at 56%, faint labels at 50% (the AA floor at micro sizes).
- **Ink** (`#07090e`): text on the rare light surface.

### Named Rules
**The One Signal Rule.** Signal Orange appears on no more than 10% of any screen. Rarity is what makes it read as a signal rather than decoration.

**The Two Accents, One Voice Rule.** Blue is structure, orange is energy. Never swap their jobs — links and wayfinding are blue, emphasis and action are orange.

### Company Wayfinding Accents

The five company accents are a deliberate journey-navigation system, not a general-purpose palette. Each color appears only within its company's stop, where it identifies the company through labels, hairlines, capability outlines and scene lighting:

- **FastTrack — Electric Blue** (`#1367FE`)
- **AutoData — Cyan** (`#42D7FF`)
- **Axxion — Orange** (`#FF4200`)
- **PAG Direct — Violet** (`#8A6CFF`)
- **Vicimus — Green** (`#34E39B`)

Signal Orange (`#ff6340`) remains the single dominant energy accent for group-level calls to action. Company colors never migrate into shared buttons, global navigation or unrelated content; their role is local identity and wayfinding only.

## 3. Typography

**Display Font:** Suisse Intl (Light 300 / Regular 400)
**Body Font:** Suisse Intl
**Label / Mono Font:** JetBrains Mono / `ui-monospace` (data labels and section numbers only)

**Character:** One family, carried by weight and case rather than by mixing typefaces. The display is light-weight and lowercase — quiet confidence, the opposite of a bold all-caps hero.

### Hierarchy
- **Display** (300, `clamp(3rem, 8vw, 8.5rem)`, line-height 0.9, lowercase): the hero statement only. Lowercase and light is the signature move.
- **Headline** (300, `clamp(2.25rem, 5vw, 4.5rem)`, line-height 1.02): section titles.
- **Title** (300, `clamp(1.75rem, 3.4vw, 3rem)`, line-height 1.02): sub-sections.
- **Body** (400, `clamp(1rem, 1.1vw, 1.125rem)`, line-height 1.7, capped ~68ch): paragraphs.
- **Label / Kicker** (600, `0.6875rem`, tracking 0.28em, UPPERCASE): eyebrows and nav.
- **Mono** (400, `0.66rem`, tracking 0.14em, UPPERCASE): data labels, stat units, section numbers.

### Named Rules
**The Lowercase Display Rule.** The hero display is lowercase and Light (300). Never set it in bold or all-caps; the restraint is the voice.

**The One Family Rule.** Suisse Intl for everything. The only second face is a monospace, and only for data, units, and section numbers.

## 4. Elevation

Flat. There are no drop shadows, no glassmorphism, and no backdrop-blur anywhere — a constraint the source Madar system shares. Depth is created three ways: the live WebGL neon field behind all content, thin hairline dividers (white at ~9%), and dark legibility scrims that follow the text column so type stays readable over the moving field. The only luminance effect is additive bloom inside the WebGL field and a soft accent glow on focus — light, never shadow.

### Named Rules
**The No-Blur Rule.** No `backdrop-filter`, no frosted glass, ever. Depth is light and hairlines, not blurred panels.

**The Light-Not-Shadow Rule.** Surfaces are flat at rest. Separation is a 1px hairline or a scrim gradient — never a box-shadow lifting a card off the page.

## 5. Components

### Buttons
- **Shape:** near-square, 4px radius.
- **Primary:** Signal Orange fill, white uppercase mono-kicker label, padding ~12–16px × 20–28px. Hover shifts to Signal Orange Deep (`#fb441a`).
- **Voice:** the primary CTA ("Partner With Us") is deliberately soft — this site trades in impression, not hard conversion.

### Inputs (contact fields)
- **Style:** translucent navy field (Page Navy at ~40%), 1px hairline border, 4px radius, white text, faint placeholder.
- **Focus:** the border shifts to Signal Orange. No heavy glow ring beyond the accent border.
- **Error:** the field's helper text turns Signal Orange with a short, specific message.

### Navigation
- **Style:** fixed and transparent, backed by a top-down dark fade so content stays legible scrolling beneath it. Links are uppercase mono-kickers with an underline-sweep on hover; the orange CTA pill sits at the right. Wordmark left.

### Cards / Containers
- **Approach:** avoid card chrome. Company entries, stats, and timeline rows are separated by hairline dividers and generous spacing, not boxed cards. Where a surface is needed (contact form, company index tiles), it is a faint translucent navy panel with a single hairline — never a raised, shadowed box.

### Signature: The Neon Journey (WebGL hero)
- A full-page fixed Three.js line-field that morphs between scenes — light-trail road, skyline, network, calm flow — driven by scroll position, finished with additive bloom. It is the brand's atmosphere; every page sits over it behind a scrim. This is the one component the whole system is built to protect.

## 6. Do's and Don'ts

### Do:
- **Do** keep Signal Orange (`#ff6340`) to ≤10% of any screen; let its rarity carry the emphasis.
- **Do** set the hero display lowercase and Light (300).
- **Do** carry depth with hairlines, scrims, and the WebGL field — light, not shadow.
- **Do** keep everything in Suisse Intl; reserve mono for data, units, and numbers.
- **Do** give every animation a `prefers-reduced-motion` path; motion is never required to reach content.

### Don't:
- **Don't** look like generic corporate or consulting — no stock-photo, muted-grey blandness.
- **Don't** look like a flashy consumer startup — no gradient-hero hype, no emoji, no playful tone.
- **Don't** look templated or off-the-shelf, like a website anyone could buy.
- **Don't** look like a car dealership or retail showroom.
- **Don't** reference any pending deal or partner that is not already public.
- **Don't** use backdrop-blur, glassmorphism, or shadowed cards to fake depth.
- **Don't** use gradient text (`background-clip: text`) or side-stripe borders as accents; emphasis is weight, size, or the one orange.
