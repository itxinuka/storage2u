# Storage2U — Design System

A fun, student-friendly brand for **Storage2U**, an on-demand storage service. Students book online how many boxes they need; Storage2U picks them up, stores them safely, and delivers them back on request — for a monthly fee per box. The brand targets students today and small businesses next, so the system reads **optimistic, helpful, and low-stress** without being childish.

This system replaces the previous navy/orange shadcn/ui theme with a **vibrant purple + lime, extra-round** identity defined in the brief's `DESIGN.md`.

## Sources this was built from
- **Codebase** (read-only, mounted locally): `storage2u/` — a Next.js 16 + React 19 app using shadcn/ui, `@base-ui/react`, **lucide-react** icons, Clerk auth, Stripe, Supabase. Key surfaces recreated here:
  - Marketing site — `storage2u/components/{hero,how-it-works,universities,pricing,navbar,footer}.tsx`
  - Booking wizard — `storage2u/.v0-design-temp/components/booking/*` (5-step flow)
  - Customer dashboard — `storage2u/components/dashboard/*` + `dashboard-view.tsx`
  - Admin console — `storage2u/components/admin/admin-overview.tsx`
- **Brand spec**: `uploads/DESIGN.md` — the authoritative new visual direction (colors, type, spacing, radii, elevation, component rules). The token files here are derived from it.

> The product copy, data shapes, and screen structure are faithful to the codebase; the **visual language** is the new `DESIGN.md` brand applied on top.

---

## Content Fundamentals
**Voice:** optimistic, plain-spoken, a little playful. We talk like a helpful friend, never like a logistics vendor.

- **Person:** address the student as **you**; the company is **we**. ("**We** pick up, **you** relax.")
- **Casing:** Sentence case for body and most headings. Uppercase only for small `label-md` eyebrows ("TRANSPARENT PRICING") and metadata.
- **Tone:** short, confident, benefit-first. Lead with the outcome ("Storage worries, gone"), not the mechanism.
- **Numbers as proof:** concrete and rounded — "5,000+ students", "20+ universities", "$0 hidden fees". Used sparingly, never as decoration.
- **Punctuation:** em-dashes for the signature beat ("Storage made simple — we pick up, you relax."). Friendly contractions ("you're", "we'll", "don't").
- **Emoji:** **none.** Energy comes from color and shape, not emoji.

**Say:** "Book a Pickup", "We come to your dorm — no hauling.", "No hidden fees, no surprise charges."
**Not:** "Premium self-storage solutions", "Utilize our facilities", "Leverage our logistics network."

---

## Visual Foundations
**Personality:** *Playful Minimalism* with *Neo-Organic* softness. Everything feels light and "pillowy."

- **Color:** Anchored by **Vibrant Purple `#6b38d4`** (primary — actions & structure) and **Lime Green `#bff365`** (energy accent — secondary CTAs, success, "popular"). Large areas use **pale lavender** surfaces (`#fcf8ff` app bg, white cards) so the vibrancy never fatigues. Text is a deep **indigo `#181445`**, never pure black. Status colors (success/warning/info/danger) are muted tints. Use 1–2 background tones per screen: lavender app bg + the occasional purple or lavender-muted section band.
- **Type:** **Plus Jakarta Sans** everywhere; JetBrains Mono for code/metadata only. Headlines run heavy (700–800) with tight negative tracking for a bold "sticker" presence. Body stays ≥16px for accessibility.
- **Shape — Extra Round:** no sharp corners anywhere. Cards `24px`, inputs & interactive elements `16px`, large surfaces `32px`, "bubble" containers `48px`, and **buttons / chips / badges / avatars are full pills**.
- **Spacing:** strict 8px rhythm; generous `lg`/`xl` vertical separation between sections for a breathable, fun feel. 64px desktop margins, max content ~1180–1440px.
- **Elevation:** depth via **soft, high-diffusion shadows tinted with the primary purple** (`rgba(107,56,212,…)`) — never harsh black drop-shadows. Cards rest on `shadow-sm`; hover/drag raises to `shadow-lg` **with a -3px lift**. Lime CTAs get an optional accent glow for "energy moments." Inputs use an **inner 2px stroke**, not a shadow.
- **Backgrounds:** mostly flat lavender/white. The only decoration is faint concentric **outline circles** on the purple hero (low-opacity white rings) — no gradients, no photography-heavy fills, no noise/grain.
- **Borders:** avoided on cards (shadow does the work). Where needed, hairlines use `--border-soft` (`#cbc3d7`); inputs and selected states use a 2px purple stroke.
- **Motion:** quick and tactile. Buttons **press down 2px** on `:active` (a "clicky" physical button); cards and selectable tiles lift and use a squishy `cubic-bezier(0.34,1.56,0.64,1)` ease. Progress fills and selections animate with a smooth `ease-out`. No infinite/looping decorative motion.
- **Hover:** primary darkens (`--brand-primary-hover`), lime darkens, ghost/outline pick up a soft `--purple-50` wash. **Press:** translateY(+2px), no color flash.
- **Imagery:** when used, warm and bright, but the brand leans on **color-blocking + iconography** over photography.

---

## Iconography
- **System: Lucide** (the codebase uses `lucide-react`). Stroke icons, 2px weight, 24×24, round caps/joins — which matches the soft brand perfectly.
- In this design system, static cards & UI kits use a small bundled Lucide set: `ui_kits/_shared/icons.jsx` exposes `<Icon name="package" size={20} />` with real Lucide path data (package, truck, calendar-check, map-pin, check, arrow-right, star, zap, box, graduation-cap, circle-check, and more). Extend it by adding the icon's Lucide path data.
- In production React, import directly from `lucide-react`. Keep stroke weight at 2; tint with `currentColor` so icons inherit text/brand color.
- Icons sit in **rounded tiles** (purple `--purple-100` bg + purple icon, or solid purple bg + white icon) at 36–56px for feature/step treatments.
- **Emoji:** not used. **Unicode glyphs:** only `✓` inside the step indicator / counter where an icon component isn't mounted.
- **Logo:** a **text wordmark** — "Storage" in ink + "2U" in the brand color (lime on dark). The compact mark is a rounded tile with "2U" set in heavy type. *(There is no pictorial glyph — an earlier v0 placeholder glyph was removed at the brand owner's request.)* See `components/brand/Logo.jsx`.

---

## What's in here (index)

**Foundations**
- `styles.css` — entry point; `@import`s every token + font file. Consumers link this one file.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `elevation.css`, `fonts.css`.
- `guidelines/*.card.html` — foundation specimen cards (Colors, Type, Spacing, Brand).

**Components** (`window.Storage2UDesignSystem_694705` after loading `_ds_bundle.js`)
- `components/forms/` — **Button**, **Input**, **Counter** (box stepper), **Chip**
- `components/feedback/` — **Badge**, **StorageStatusBadge**, **ProgressBar**
- `components/layout/` — **Card**
- `components/navigation/` — **StepIndicator**
- `components/brand/` — **Logo**, **Avatar**

**UI Kits** (`ui_kits/<product>/index.html` — interactive recreations)
- `marketing/` — landing page (hero, how-it-works, universities, pricing, footer)
- `booking/` — 5-step booking wizard with confirmation (the product centerpiece)
- `dashboard/` — customer "My Storage" (active items + history, request delivery)
- `admin/` — operations console (stats, today's pickups, delivery requests)
- `_shared/icons.jsx` — shared Lucide icon set used by all kits

**Meta**
- `SKILL.md` — Agent Skill manifest for reuse in Claude Code.

---

## Usage
Link the stylesheet and the compiled bundle, then read components off the namespace:
```html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
<script>
  const { Button, Card, StorageStatusBadge } = window.Storage2UDesignSystem_694705;
</script>
```
All visual styling flows through CSS custom properties (`--brand-primary`, `--radius-lg`, `--shadow-sm`, …), so theming and overrides happen at the token layer.

## Known caveats
- **Fonts** load from **Google Fonts** (`Plus Jakarta Sans`, `JetBrains Mono`) via `@import` in `tokens/fonts.css` — no binaries are shipped. For fully offline/self-hosted use, download the families and add `@font-face` rules there.
- The logo is intentionally text-only (no pictorial mark). If a custom glyph/wordmark file exists, drop it into `assets/` and update `components/brand/Logo.jsx`.
