import "server-only"

import { appendFileSync, mkdirSync } from "fs"
import { dirname, join } from "path"

const SESSION_ID = "106bf1"
const LOG_PATH = join(process.cwd(), ".cursor", "debug-106bf1.log")

export function debugLog(
  location: string,
  message: string,
  data: Record<string, unknown>,
  hypothesisId: string
) {
  const payload = {
    sessionId: SESSION_ID,
    location,
    message,
    data,
    hypothesisId,
    timestamp: Date.now(),
  }
  try {
    mkdirSync(dirname(LOG_PATH), { recursive: true })
    appendFileSync(LOG_PATH, `${JSON.stringify(payload)}\n`)
  } catch {
    // ignore
  }
  console.error(`[debug ${SESSION_ID}]`, location, message, data)
}
