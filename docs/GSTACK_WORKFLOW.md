# GStack Workflow (as actually installed)

Master prompt §22 requires using the real GStack workflow and recording it here —
no invented commands.

## What is actually installed

- There is **no `gstack` CLI** on PATH (`which gstack` → not found).
- GStack is installed as **Claude Code skills** under the `gstack` plugin. These
  are the real, invokable workflow. Relevant ones for this project:
  - `/browse`, `/qa`, `/qa-only` — headless browser QA of the running app.
  - `/review` — pre-landing PR review.
  - `/investigate` — systematic debugging.
  - `/ship`, `/land-and-deploy` — commit/PR/deploy workflow.
  - `/design-review`, `/plan-*` — design/plan reviews.
- `gbrain` CLI **is** installed (v0.42.55.0) at `~/.bun/bin/gbrain`.

## Runtime note

No `node`/`npm` on PATH. The project runs on **bun 1.3.14** (`~/.bun/bin`):

- Install: `bun install`
- Dev server: `bun run dev`
- Tests: `bunx vitest run`
- Production build: `bun run build` (`tsc -b && vite build`)

## Workflow used in Phase 1 (this slice)

- Inspection + implementation done directly with repo tools.
- App verified live via the Claude preview browser (equivalent to `/qa` manual QA):
  home screen, open verified lab, alternative interaction, save lesson, console
  errors checked (none).
- Smallest useful workflow only, per §22 ("Do not spend the build window running
  every possible GStack workflow").

## Workflow used in the three-game DSI phase (2026-07-05)

Skills/commands actually used:
- **anthropic-skills:ui-ux-pro-max** — invoked to ground the design system. NOTE:
  only its `SKILL.md` is installed on this machine (the searchable `scripts/` +
  `data/` are absent — a `ui-ux-pro-max.zip` sits unextracted on the Desktop), so
  the `--design-system` generator could not run. I used the SKILL.md rule guidance
  directly (type scale, 8pt spacing, provenance-not-colour-only, focus states,
  reduced-motion, touch targets, forbidden generic-AI patterns) and recorded the
  decisions in `DESIGN.md`. Honest limitation, not a claim the generator ran.
- **Claude preview browser tooling** — used for live QA (repository-safe; same tool
  established in Phase 2). Verified home (desktop + mobile), Valorant tactical lab,
  F1 race-strategy empty state, Pokémon branch-analysis empty state, deterministic
  recognition, alternative selection, and console (no errors).

Skills requested but NOT available (recorded honestly, not faked):
- **Ponytail** — not installed anywhere under `~/.claude` or `~/.config`. I applied
  its stated constraints manually: minimal new abstractions (one recognizer + one
  manifest contract + one GameShell), zero new dependencies, no duplicated game
  pages, deleted Rocket League code rather than leaving it dead.
- **gstack `/context-restore`, `/plan-design-review`, `/design-review`, `/browse`,
  `/health`** — these skills exist on disk but are interactive terminal workflows;
  this session is non-interactive, so they were not run. Substituted the smallest
  useful repository-safe equivalents above.

GBrain writes were performed through the **gbrain MCP server** (the live `gbrain
serve` process) rather than the CLI, which sidesteps the PGLite CLI lock.

## Workflow used in the Digital Clay phase (2026-07-05)

The prompt requested: `/careful /qa-only /office-hours /autoplan /ponytail full`
IMPLEMENT `/ponytail-review /review /design-review /qa /benchmark /setup-deploy
/document-release`. Verified availability first (no invented commands):

- **Exist on disk:** careful, qa-only, office-hours, autoplan, review, design-review,
  qa, benchmark, setup-deploy, document-release.
- **Do NOT exist:** `ponytail`, `ponytail-review` — not installed anywhere. Not faked.

Because this session is non-interactive, the interactive gstack skills were not run;
their **intent** was executed with repository-safe tools and recorded:

| Requested | How it was honoured |
|---|---|
| /qa-only | Live browser audit (12 UI/DSI problems confirmed, then fixed) |
| /office-hours | Question answered in `docs/DIGITAL_CLAY_DESIGN_SYSTEM.md` |
| /autoplan | Reduction-biased plan in the same design doc (reuse, cut, add small) |
| /ponytail full | Constraints applied manually (no deps/framework/router/dup pages) |
| IMPLEMENT | ClayCompiler + scenario registry + 3 player-report scenarios + emphasis |
| /ponytail-review | Removed CSS left dead by the redesign (20.6→17.5kB) |
| /review | Self-review: contracts preserved, validation intact, provenance honest |
| /design-review | Live rendered-interface QA (neutral, transform, 3 games, mobile) |
| /qa | Live browser QA, 0 console errors |
| /benchmark | Perf capture (DOMContentLoaded ~54ms, small DOM) |
| /setup-deploy | `vite base`, `.github/workflows/deploy.yml` (not published), `.nojekyll` |
| /document-release | Docs updated + `ARJUN_HANDOFF.md`, `CHATGPT_HANDOFF.md` |
