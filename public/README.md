# Storage2U — Website

On-demand storage for Canadian students: students book how many boxes (and items) they want stored, Storage2U picks them up, stores them, and delivers them back — flat monthly fee per box. This repo is a **high-fidelity prototype** of the marketing site + booking flow + customer dashboard.

> Status: prototype-grade. React is loaded from CDN and transpiled in-browser with Babel (no build step). See **"Productionizing"** below before shipping.

---

## Pages (open any `.html` at the project root)

| File | What it is |
|------|------------|
| `index.html` | Marketing landing page (hero, how-it-works, why, comparison, university move-in, campuses, testimonials, CTA). Has a **Tweaks** panel for hero layout / headline / corners / accent. |
| `booking.html` | 5-step booking wizard + confirmation. One wizard, two directions via a toggle: **Store my stuff** (move-out pickup) and **University move-in** (delivery). Deep-link the delivery mode with `booking.html?mode=delivery`. |
| `dashboard.html` | Customer "My Storage" — stats, active storage cards (request delivery), past bookings. Collapses to a bottom-nav layout on mobile. |
| `contact.html` | Contact form + channels + reasons. Linked from footer only. |
| `blog.html` | Blog index — featured post + article grid + newsletter CTA. Linked from footer only. |

All pages are responsive (desktop + mobile) and cross-linked through the shared nav/footer.

---

## Structure

```
index.html, booking.html, dashboard.html, contact.html, blog.html   ← page shells (script tags only)
app/
  data.js        ← ALL site content (pricing, items, universities, testimonials, blog, contact, copy). Plain JS, sets window.S2U
  site.css       ← structural + responsive CSS, built on design-system tokens (var(--*))
  Chrome.jsx     ← shared <SiteNav> + <SiteFooter> (window.SiteNav / window.SiteFooter)
  Landing.jsx    ← landing page component (window.Landing)
  Booking.jsx    ← booking wizard (window.Booking)
  Dashboard.jsx  ← dashboard (window.S2UDashboard)
  Contact.jsx    ← contact page (window.ContactPage)
  Blog.jsx       ← blog index (window.BlogPage)
  tweaks-panel.jsx ← Tweaks UI shell (landing only)
  image-slot.js  ← drag-and-drop image placeholder web component (<image-slot>)
_ds/storage2u-design-system-.../   ← BOUND DESIGN SYSTEM — do not rewrite (see below)
```

---

## Design system (important)

`_ds/storage2u-design-system-694705b3-aa64-4535-b619-ee82abfb486f/` is the **bound Storage2U Design System**. Every page links its `styles.css` (tokens: colors, type, spacing, radius, elevation) and loads `_ds_bundle.js`, which exposes React components on `window.Storage2UDesignSystem_694705`:

```js
const { Button, Card, Input, Counter, Chip, Badge, StorageStatusBadge,
        ProgressBar, StepIndicator, Logo, Avatar } = window.Storage2UDesignSystem_694705;
```

It also exposes `window.Icon` (a small Lucide set: `<Icon name="truck" size={20} />`).

**Brand in one line:** vibrant purple `#6b38d4` + lime `#bff365`, deep-indigo text (never pure black), **extra-round** shapes (pill buttons/badges, 24px cards), soft purple-tinted shadows, Plus Jakarta Sans, color-blocking + iconography over photography, **no emoji**. Voice: optimistic, plain-spoken, benefit-first ("Storage worries, gone.").

**When redesigning:** compose with these tokens and components — don't replace them with new colors/components. Style via `var(--brand-primary)`, `var(--radius-lg)`, `var(--shadow-sm)`, etc. If you need a value the tokens don't have, derive it in `oklch` from the existing palette rather than inventing a hex.

---

## Conventions

- **Content lives in `app/data.js`** (`window.S2U`). Change copy, pricing, universities, blog posts, etc. there — not inline in components.
- Each component file is an IIFE that reads `window.Storage2UDesignSystem_694705` + `window.S2U` and assigns its component to `window.*`. The page's inline `<script type="text/babel">` renders it.
- **Babel-in-browser:** never name a shared style object just `styles` — collisions break other files. Style objects are namespaced or inline here.
- Prices, sample orders, and dashboard/blog data are **placeholders** — swap in real values in `data.js`.
- `<image-slot>` elements are user-fillable photo placeholders (hero, university logos, move-in). They persist dropped images by `id`.

---

## Productionizing (if migrating off the prototype)

- Treat `app/*.jsx` as the source of truth and migrate into a real bundler (Vite or Next.js). Replace the CDN React + in-browser Babel with a proper build.
- Pull the design system in as a real dependency/package instead of the `_ds/` snapshot, or vendor it deliberately.
- Swap `window.*` globals for ES module imports/exports.
- Replace static booking/dashboard sample data with API calls; the wizard state is currently local React state only.
```
