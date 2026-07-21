import sharp from "sharp"
import { mkdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, "..", "public", "brand")

const colors = {
  storage: "#181445",
  twoU: "#6b38d4",
  iconBg: "#6b38d4",
  iconText: "#ffffff",
}

const logoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="160" viewBox="0 0 640 160">
  <rect width="640" height="160" fill="none"/>
  <text x="20" y="112" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="96" font-weight="800" letter-spacing="-2">
    <tspan fill="${colors.storage}">Storage</tspan><tspan fill="${colors.twoU}">2U</tspan>
  </text>
</svg>`

const iconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="none"/>
  <rect x="56" y="56" width="400" height="400" rx="96" fill="${colors.iconBg}"/>
  <text x="256" y="300" text-anchor="middle" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="168" font-weight="800" fill="${colors.iconText}">2U</text>
</svg>`

await mkdir(outDir, { recursive: true })

const logoPath = path.join(outDir, "storage2u-logo.png")
const iconPath = path.join(outDir, "storage2u-icon.png")

await sharp(Buffer.from(logoSvg))
  .png()
  .toFile(logoPath)

await sharp(Buffer.from(iconSvg))
  .png()
  .toFile(iconPath)

const logoMeta = await sharp(logoPath).metadata()
const iconMeta = await sharp(iconPath).metadata()

console.log("Generated brand assets:")
console.log(`  ${logoPath} (${logoMeta.width}x${logoMeta.height})`)
console.log(`  ${iconPath} (${iconMeta.width}x${iconMeta.height})`)
