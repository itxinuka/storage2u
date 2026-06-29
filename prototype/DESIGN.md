---
name: Vibrant Student Storage
colors:
  surface: '#fcf8ff'
  surface-dim: '#dad6ff'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f2ff'
  surface-container: '#efebff'
  surface-container-high: '#e9e5ff'
  surface-container-highest: '#e3dfff'
  on-surface: '#181445'
  on-surface-variant: '#494454'
  inverse-surface: '#2d2a5b'
  inverse-on-surface: '#f3eeff'
  outline: '#7b7486'
  outline-variant: '#cbc3d7'
  surface-tint: '#6d3bd7'
  primary: '#6b38d4'
  on-primary: '#ffffff'
  primary-container: '#8455ef'
  on-primary-container: '#fffbff'
  inverse-primary: '#d0bcff'
  secondary: '#476800'
  on-secondary: '#ffffff'
  secondary-container: '#bcf063'
  on-secondary-container: '#4b6d00'
  tertiary: '#505f59'
  on-tertiary: '#ffffff'
  tertiary-container: '#687872'
  on-tertiary-container: '#f4fff9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#bff365'
  secondary-fixed-dim: '#a4d64c'
  on-secondary-fixed: '#131f00'
  on-secondary-fixed-variant: '#354e00'
  tertiary-fixed: '#d5e6df'
  tertiary-fixed-dim: '#bacac3'
  on-tertiary-fixed: '#101e1a'
  on-tertiary-fixed-variant: '#3b4a44'
  background: '#fcf8ff'
  on-background: '#181445'
  surface-variant: '#e3dfff'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style
The design system is engineered to capture the high-energy, transient lifestyle of students. It departs from the sterile, industrial aesthetic of traditional storage solutions by embracing a **Playful Minimalism** infused with **Neo-Organic** elements. The brand personality is optimistic, helpful, and hyper-modern, aimed at making the stressful process of moving feel like a seamless lifestyle upgrade.

The visual direction prioritizes soft geometries, vibrant color blocking, and generous white space to ensure the interface remains legible and accessible despite its high-energy palette. The emotional response should be one of "lightness"—both in terms of the physical burden of storage and the digital experience of managing it.

## Colors
The palette is anchored by a high-contrast pairing of **Vibrant Purple** and **Lime Green**. Purple serves as the primary brand carrier, used for key actions and structural elements. Lime Green acts as a high-visibility accent for "energy moments"—notifications, secondary buttons, and success states.

To maintain a soft feel, the UI utilizes **Pale Mint** and **Soft Lavender** for large surface areas and container backgrounds, preventing the "vibrancy" from becoming fatiguing. Text is set in a deep indigo-tinted neutral (#1E1B4B) rather than pure black to maintain a harmonious, premium feel while meeting WCAG AA contrast requirements.

## Typography
**Plus Jakarta Sans** is the exclusive typeface for the design system. Its modern, slightly rounded apertures complement the "Extra Round" shape language. 

- **Headlines:** Use tight letter-spacing and heavy weights (700-800) to create a bold, "sticker-like" presence.
- **Body Text:** Maintained at 16px minimum for accessibility.
- **Micro-copy:** Use the `label-md` style for category tags and small UI metadata, utilizing a slight tracking increase for readability at small sizes.

## Layout & Spacing
The system utilizes a **Fluid Grid** with a specific focus on "Chunky" containers. 

- **Mobile (0-599px):** 4-column grid, 16px margins, 16px gutters.
- **Tablet (600-1023px):** 8-column grid, 32px margins, 20px gutters.
- **Desktop (1024px+):** 12-column grid, 64px margins (max-width 1440px), 24px gutters.

The spacing rhythm follows an 8px base scale. Use `lg` and `xl` spacing for section vertical separation to maintain the "breathable" and "fun" feel of the interface.

## Elevation & Depth
Depth is expressed through **Tonal Layering** and **Soft Ambient Shadows**. This design system avoids harsh dropshadows.

- **Level 0 (Base):** Background Accents (Lavender/Mint).
- **Level 1 (Cards):** White surfaces with a very soft, high-diffusion shadow (8% opacity Primary color) to make elements appear "pillowy."
- **Level 2 (Interactive):** Elements that are being hovered or dragged should use a slightly more defined shadow and a scale transform of 1.02x to emphasize the tactile, squishy nature of the UI.
- **In-set Depth:** Input fields use a subtle 1px inner stroke in a darker tint of the background color rather than a shadow to keep the interface clean.

## Shapes
The shape language is **Extra Round**. Following the "Round_Twelve" philosophy, every interactive element should feel approachable and friendly. There are no sharp corners in this design system.

- **Standard Elements:** 1rem (16px) radius.
- **Buttons & Chips:** Full pill-shaped (capsule) radius.
- **Large Containers:** 3rem (48px) radius for top corners or full enclosure to create a "bubble" container effect.

## Components
- **Buttons:** Primary buttons are Solid Purple with White text. Secondary buttons are Solid Lime Green with Indigo text. All buttons use a 2px vertical offset on hover to simulate a "clicky" physical button.
- **Chips/Badges:** Used for storage sizes (Small, Medium, Large). Use light-tint backgrounds with dark-tint text of the same hue (e.g., Light Purple background with Deep Purple text).
- **Cards:** White backgrounds with 32px padding and `rounded-xl` corners. Borders should be avoided; use subtle shadow-based elevation instead.
- **Input Fields:** Oversized (56px height) with full-pill rounding. Use a 2px stroke that turns Primary Purple on focus. 
- **Checkboxes/Radios:** Circular for both to maintain the "round" theme, using the Primary Purple for the selected state.
- **Progress Indicators:** Thick, 12px rounded bars. Use the Lime Green for the progress fill to signify movement and energy.