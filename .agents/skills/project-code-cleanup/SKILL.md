---
name: project-code-cleanup
description: >-
  Scans the entire Storage2u repository for hygiene-only cleanup: debug logs,
  temporary comments, dead code, unused imports, unused exports, and unused
  files. Use when asked to clean up the project, scan for dead code, remove
  unused files, repo hygiene, project-wide cleanup, or tidy the whole codebase.
  Never changes functionality—remove or reorganize only. Not for refactoring
  logic, fixing bugs, or specs-task cleanup (use specs-code-cleanup for that).
---

# Project-Wide Code Cleanup

## Overview

Whole-repo hygiene cleanup adapted from `specs-code-cleanup`, without task/review gates. Scans the Storage2u Next.js/TypeScript codebase and removes only unnecessary artifacts while preserving behavior.

**Input**: Optional scope (`--scope=app,components,lib` or full repo)  
**Output**: Cleaned code + cleanup report in the conversation (no task-file status updates)

## When to Use

- User asks to clean up the project, scan for dead code, remove unused files, or do repo hygiene.
- User wants a project-wide pass, not a single specs task.
- Not for changing product logic, APIs, schemas, or migrations.

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `--scope` | No | Comma-separated roots (default: full app scan roots below) |
| `--dry-run` | No | If set, report candidates only; do not delete or edit |
| `--lang` | No | Defaults to `typescript` / React / Next for this repo |

## Hard Constraints

- **Clean, not change**: Only remove or reorganize — never change functionality.
- **Preserve behavior**: Code must work exactly the same after cleanup.
- Prefer **delete/remove** over rewrite.
- When unsure (dynamic imports, string routes, Supabase RPC names, Clerk/webhook handlers) → **keep** and list under “needs human review”.
- **Never delete**: `supabase/migrations/**`, env examples (`.env*`), skills (`.agents/skills/**`, `.claude/skills/**`), lockfiles, generated DB types unless clearly orphaned and confirmed.
- Do not change control flow, public APIs, schemas, migrations, or product copy.
- **Stop on failure**: If lint or tests fail after edits, stop and report — do not continue removing more.

See `references/language-patterns.md` and `references/safe-removal-checklist.md`.

## Instructions

Use TodoWrite to track all phases. Default language for this repo: TypeScript / React / Next.js.

### Phase 1: Scope Inventory

1. Resolve `--scope` or use default scan roots:
   - Include: `app/`, `components/`, `lib/`, `hooks/` (if present), top-level scripts, obvious temp/scratch dirs at repo root
   - Exclude: `node_modules/`, `.next/`, `supabase/.temp/`, `.git/`, lockfiles, build caches
2. List top-level candidates that look temporary (e.g. design scratch folders) for later review — do not delete yet.
3. Document the inventory in the todo list / report draft.

### Phase 2: Technical Debt Scan

Search scoped files with Grep for:

- `console.log`, `console.debug`, `console.info` (keep `console.error` / `console.warn` unless clearly debug-only)
- `debugger`
- `// DEBUG`, `// temp`, `// TEMP`, `// hack`, `// HACK`
- Resolved `TODO` / `FIXME` comments (keep unresolved ones with real context)

For each hit: read surrounding context. Remove only confirmed non-functional debt. Document what was removed.

### Phase 3: Unused File / Export Candidates

1. Find modules with no importers (Grep for basename / `@/...` path).
2. For App Router: treat `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx`, `middleware.ts` as entrypoints — never delete solely for “no import”.
3. Check route folders under `app/` are reachable (linked or intentional routes).
4. Unused named exports: only remove if unused across the repo and not part of a public barrel intended for external use.
5. Before deleting any file or directory, complete `references/safe-removal-checklist.md`.
6. If `--dry-run`, list candidates only.

### Phase 4: Import and Readability Hygiene

1. Remove unused imports (manual or via `npm run lint` / ESLint fix if safe).
2. Do not reorder code for style alone unless a project formatter is already standard.
3. Remove dead code only when obviously unreachable and safe (see checklist).
4. No signature or logic changes.

### Phase 5: Verification Gate

1. Run `npm run lint`
2. Run `npm test`
3. Confirm no intentional behavior/API changes in the diff
4. If either command fails → **stop**, revert or fix only the cleanup-induced break, and report

### Phase 6: Cleanup Report

Report to the user:

- Scope scanned
- Files deleted
- Files edited (summary of removals)
- Items kept for human review
- Verification: lint / test pass or fail

Do not update specs task files or `skills-lock.json`.

## Examples

### Full repo cleanup

User: “Scan the whole project and remove unused code.”

1. Inventory `app/`, `components/`, `lib/`
2. Remove debug `console.log`s and dead temp comments
3. Delete confirmed-unreferenced modules after checklist
4. `npm run lint` && `npm test`
5. Deliver cleanup report

### Dry run

User: “Find unused files but don’t delete anything.”

Pass `--dry-run`: complete Phases 1–3, output candidate list only.

## Relationship to specs-code-cleanup

| | `project-code-cleanup` | `specs-code-cleanup` |
|--|------------------------|----------------------|
| Scope | Whole repo / folders | Single reviewed task |
| Input | Optional `--scope` | Task file under `docs/specs/` |
| Output | Report in chat | Task marked completed |

Use `specs-code-cleanup` only when cleaning a reviewed specs task.
