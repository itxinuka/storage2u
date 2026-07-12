import { spawnSync } from "node:child_process"
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const manifestPath = path.join(__dirname, "stripe-brand-manifest.json")
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"))

function runStripeToolsBrandUpdate() {
  const body = JSON.stringify({
    primary_color: "rgb(107, 56, 212)",
    contrast_color: "rgb(104, 52, 211)",
    font_color: "rgb(255, 255, 255)",
    checkout_background_color: "rgb(252, 248, 255)",
    checkout_button_color: "rgb(107, 56, 212)",
    secondary_color: "rgb(191, 243, 101)",
    checkout_use_brand_colors: false,
    use_logo_instead_of_icon: true,
    icon: manifest.iconFileId,
    logo: manifest.logoFileId,
    checkout_border_style: "round",
  })

  const result = spawnSync(
    "cmd.exe",
    ["/c", "stripe", "tools", "execute", "update_brand_settings", "--body", body, "--json"],
    { encoding: "utf8" }
  )

  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim()
  if (!output) return { ok: false, message: "No response from stripe tools" }

  try {
    const parsed = JSON.parse(output)
    if (parsed.error) {
      return { ok: false, message: parsed.error.message ?? JSON.stringify(parsed.error) }
    }
    return { ok: true, data: parsed }
  } catch {
    return { ok: false, message: output }
  }
}

function openDashboardPages() {
  const urls = [
    manifest.dashboardUrls.branding,
    manifest.dashboardUrls.publicDetails,
    manifest.dashboardUrls.checkoutSettings,
  ]

  for (const url of urls) {
    spawnSync("cmd.exe", ["/c", "start", "", url], { stdio: "ignore" })
  }
}

console.log("Storage2U Stripe sandbox branding setup\n")

const logoPath = path.join(root, manifest.assets.logo)
const iconPath = path.join(root, manifest.assets.icon)
if (!existsSync(logoPath) || !existsSync(iconPath)) {
  console.log("Generating brand assets...")
  spawnSync("node", [path.join(__dirname, "generate-brand-assets.mjs")], {
    cwd: root,
    stdio: "inherit",
  })
}

console.log("Uploaded Stripe file IDs:")
console.log(`  Logo: ${manifest.logoFileId}`)
console.log(`  Icon: ${manifest.iconFileId}`)

console.log("\nApplying account branding via Stripe tools...")
const brandResult = runStripeToolsBrandUpdate()
if (brandResult.ok) {
  console.log("Account branding updated successfully.")
} else {
  console.log("Account branding API unavailable in test mode:")
  console.log(`  ${brandResult.message}`)
  console.log("\nConfigure manually in Dashboard:")
  console.log(`  Branding: ${manifest.dashboardUrls.branding}`)
  console.log("  - Logo: upload public/brand/storage2u-logo.png")
  console.log("  - Icon: upload public/brand/storage2u-icon.png")
  console.log(`  - Brand color: ${manifest.colors.primary}`)
  console.log(`  - Accent color: ${manifest.colors.accent}`)
  console.log(`  - Checkout background: ${manifest.colors.background}`)
  console.log(`  - Checkout button: ${manifest.colors.primary}`)
  console.log("  - Use logo instead of icon: enabled")
}

console.log("\nPublic details (Dashboard):")
console.log(`  URL: ${manifest.dashboardUrls.publicDetails}`)
console.log(`  Support email: ${manifest.publicDetails.supportEmail}`)
console.log(`  Website: ${manifest.publicDetails.website}`)
console.log(`  Privacy policy: ${manifest.publicDetails.privacyPolicy}`)
console.log(`  Terms of service: ${manifest.publicDetails.termsOfService}`)

console.log("\nCheckout settings (Dashboard):")
console.log(`  URL: ${manifest.dashboardUrls.checkoutSettings}`)
console.log("  - Enable Contact information")
console.log("  - Enable Legal policies")

if (process.argv.includes("--open-dashboard")) {
  console.log("\nOpening Dashboard pages...")
  openDashboardPages()
}

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`\nManifest saved to ${manifestPath}`)
