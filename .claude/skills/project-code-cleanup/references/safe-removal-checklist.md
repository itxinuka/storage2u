# Safe Removal Checklist

Complete every item before deleting a file, directory, or export. If any check fails or is uncertain → **keep** and add to “needs human review”.

## Before deleting a file or directory

- [ ] No static imports of the module path (`@/...` or relative) anywhere in the repo
- [ ] No dynamic `import()` / `require()` string references to the path
- [ ] Not an App Router entrypoint (`page`, `layout`, `route`, `loading`, `error`, etc.)
- [ ] Not referenced from `next.config.*`, middleware, or env-driven path config
- [ ] Not a Supabase migration, seed, or Edge Function deployment artifact
- [ ] Not env / secrets / credentials templates (`.env*`, `*.pem`, keys)
- [ ] Not a skill, rule, agent config, or lockfile
- [ ] Not only “unused” because usage is via string route, RPC name, or webhook path
- [ ] Parent barrel (`index.ts`) updated if it re-exported the symbol — remove export only, do not change other exports’ behavior

## Before removing an export or function

- [ ] Grep shows zero references to the symbol name (including type-only imports)
- [ ] Not part of a public API consumed outside this repo (document if unsure → keep)
- [ ] Removing it does not change runtime branching of remaining code
- [ ] Tests that only existed for this dead code may be deleted with it; do not weaken tests for live code

## Before removing comments / logs

- [ ] Comment is resolved debt or noise, not an explanation of non-obvious invariant
- [ ] Log is debug-only; error/warn reporting for real failures stays
- [ ] Removal does not alter JSX text or user-visible copy

## Never delete (hard deny)

- `supabase/migrations/**`
- `.agents/skills/**`, `.claude/skills/**`, `.cursor/**` config needed for agents
- `skills-lock.json`, `package-lock.json`
- Production env files and secrets
- Generated types that are still imported (e.g. `lib/database.types.ts` while in use)

## After any deletion batch

- [ ] `npm run lint` passes
- [ ] `npm test` passes
- [ ] Diff contains only removals / unused-import cleanups — no logic edits
