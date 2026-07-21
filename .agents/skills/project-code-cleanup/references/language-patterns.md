# Language Patterns (Storage2u)

Repo-specific formatter, lint, and search patterns for `project-code-cleanup`.

## Project commands

| Step | Command |
|------|---------|
| Lint | `npm run lint` |
| Test | `npm test` |
| Format | Prefer ESLint fixes only if already configured; no separate `format` script unless added later |

Default stack: TypeScript, React 19, Next.js (App Router).

## Import ordering

When touching imports, keep existing project style:

1. External packages (`react`, `next`, `@clerk/...`, `@supabase/...`, etc.)
2. Absolute internal (`@/...`)
3. Relative (`./...`, `../...`)

Do not mass-reorder imports across files for style alone.

## Grep patterns (TypeScript / TSX)

```bash
# Debug / temp
rg -n "console\\.(log|debug|info)\\(" --glob "*.ts" --glob "*.tsx"
rg -n "\\bdebugger\\b" --glob "*.ts" --glob "*.tsx"
rg -n "//\\s*(DEBUG|TEMP|temp|hack|HACK)" --glob "*.ts" --glob "*.tsx"
rg -n "TODO|FIXME" --glob "*.ts" --glob "*.tsx"

# Import usage for a module basename (example: pickup-data)
rg -n "pickup-data|from ['\\\"]@/lib/ops/pickup-data" --glob "*.{ts,tsx}"
```

Exclude when searching: `node_modules/`, `.next/`, `supabase/.temp/`.

## Entrypoints (never treat as “unused” solely for missing imports)

- `app/**/page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx`, `template.tsx`, `default.tsx`
- `middleware.ts` / `proxy.ts` at app or project root (whichever the Next version uses)
- Next.js special files and Clerk/Stripe webhook route handlers

## Keep intentional logging

Prefer keeping:

- `console.error` / `console.warn` in server actions and API routes when they are error reporting
- Structured logging that is clearly production diagnostics

Remove:

- Ad-hoc `console.log` left from debugging
- Commented-out blocks that duplicate live code
