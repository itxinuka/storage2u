function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h
  let s
  const l = (max + min) / 2
  if (max === min) {
    h = 0
    s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      default:
        h = ((r - g) / d + 4) / 6
        break
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 }
}

function hslToRgb(h, s, l) {
  h /= 360
  s /= 100
  l /= 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1))
  const m = l - c / 2
  let r = 0
  let g = 0
  let b = 0
  const hue = h * 6
  if (hue < 1) {
    r = c
    g = x
  } else if (hue < 2) {
    r = x
    g = c
  } else if (hue < 3) {
    g = c
    b = x
  } else if (hue < 4) {
    g = x
    b = c
  } else if (hue < 5) {
    r = x
    b = c
  } else {
    r = c
    b = x
  }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}

function luminance(r, g, b) {
  const channels = [r, g, b].map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

const primary = hexToRgb("#6b38d4")
const hsl = rgbToHsl(primary.r, primary.g, primary.b)
const dark = hslToRgb(hsl.h, hsl.s, Math.max(0, hsl.l - 1))
const lum = luminance(primary.r, primary.g, primary.b)
const font = lum > 0.5 ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)"

const body = {
  primary_color: `rgb(${primary.r}, ${primary.g}, ${primary.b})`,
  contrast_color: `rgb(${dark.r}, ${dark.g}, ${dark.b})`,
  font_color: font,
  checkout_background_color: "rgb(252, 248, 255)",
  checkout_button_color: `rgb(${primary.r}, ${primary.g}, ${primary.b})`,
  secondary_color: "rgb(191, 243, 101)",
  checkout_use_brand_colors: false,
  use_logo_instead_of_icon: true,
  icon: "file_1TrJiVRt5Yna6OxDqweeXHWy",
  logo: "file_1TrJiWRt5Yna6OxDxoQhPPvG",
  checkout_border_style: "round",
}

console.log(JSON.stringify(body, null, 2))
