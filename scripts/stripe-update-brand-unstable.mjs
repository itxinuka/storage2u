import { config } from "dotenv"
import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.join(__dirname, "..", ".env.local") })

const body = JSON.parse(
  readFileSync(path.join(__dirname, "stripe-brand-body.json"), "utf8")
)

const params = new URLSearchParams()
for (const [key, value] of Object.entries(body)) {
  params.set(key, String(value))
}

const key = process.env.STRIPE_SECRET_KEY
const endpoint = "https://api.stripe.com/v1/_unstable/settings/brand"

console.log(`POST ${endpoint}`)
const res = await fetch(endpoint, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/x-www-form-urlencoded",
    "Stripe-Version": "2026-06-24.dahlia",
  },
  body: params,
})
const json = await res.json()
console.log(res.status, JSON.stringify(json, null, 2))
