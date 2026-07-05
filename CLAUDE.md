# Hackathon Project

## What this is

TBD — likely a website, stack not yet chosen. Update this section as soon as the
idea and stack are locked in; until then, treat everything below as the
tooling baseline, not a description of the app.

## Hackathon requirement: gstack + gbrain are primary

This hackathon requires demonstrable, heavy use of **gstack** (the skill
suite: `/spec`, `/plan`, `/qa`, `/review`, `/ship`, `/browse`,
`/investigate`, `/office-hours`, `/context-save`, etc.) and **gbrain**
(persistent memory/search). Treat them as the main interface for doing
work in this repo, not optional extras:

- Default to a gstack skill over an ad-hoc approach whenever one exists for
  the task (see the routing list below).
- Prefer `gbrain search "<terms>"` / `gbrain query "<question>"` over Grep
  once there's code to index — see the Search Guidance block below.
- Log durable decisions (architecture, scope, tool choices, reversals) with
  `gstack-decision-log` as they're made, not just at the end — judges/teammates
  should be able to see the "why" trail in gbrain, not just the final diff.
- Checkpoint with `/context-save` at real milestones so progress is
  recoverable through gbrain artifacts, not just git history.

ECC rules, ponytail, and ui-ux-pro-max (below) are supporting layers that
operate *underneath* this gstack/gbrain-driven workflow — they shape how
code and design decisions get made once gstack has framed what to build.

## Toolchain

- **gstack skills (primary)** — `/office-hours` or `/spec` to shape an idea,
  `/plan` or `/plan-eng-review` to lock architecture, `/investigate` for
  bugs, `/qa` or `/browse` to test the real app, `/review` for a diff/PR,
  `/ship` to land and deploy, `/context-save` / `/context-restore` to
  checkpoint and resume.
- **gbrain (primary)** — persistent project memory and semantic search,
  registered as an MCP server (`gbrain` — see GBrain Configuration below).
  Search it before grepping; log decisions into it as you go.
- **ECC rules** (`.claude/rules/ecc/`) — vendored copies of `common`, `web`,
  `typescript`, and `react` from the ECC plugin, so every contributor's Claude
  Code follows the same conventions regardless of their own global config.
  If the stack turns out not to be TypeScript/React, swap the language
  directory (e.g. `~/.claude/rules/ecc/python`) for the right one and delete
  the unused ones — see `.claude/rules/ecc/README.md`.
- **ponytail** — a minimalism discipline applied while writing code: before
  adding anything, check in order — does this need to exist? is it already in
  the codebase? does stdlib do it? does the platform do it natively? is it an
  installed dependency? can it be one line? Only write more once every rung
  above is exhausted. Install once (global, not project-scoped):
  `/plugin marketplace add DietrichGebert/ponytail` then
  `/plugin install ponytail@ponytail` (two separate prompts).
- **ui-ux-pro-max** (`.claude/skills/ui-ux-pro-max/` + `design`,
  `design-system`, `ui-styling`, `brand`, `banner-design`, `slides`) —
  design intelligence: styles, color palettes, font pairings, chart types,
  and per-stack UX guidelines. Auto-triggers on anything UI/UX-shaped
  (building pages, components, choosing a color/type system, reviewing
  visual/accessibility quality) — no need to invoke it explicitly. Installed
  via `npx ui-ux-pro-max-cli init --ai claude`; run that again in this repo
  to pull updates.

## Workflow (gstack/gbrain-driven)

1. `/office-hours` or `/spec` — shape and scope the idea before writing code.
2. `/plan` or `/plan-eng-review` — lock the architecture; log the key calls
   with `gstack-decision-log` as they're made.
3. TDD: write the test first (see `.claude/rules/ecc/common/testing.md`),
   then implement — applying the ponytail minimalism ladder and, for
   anything visual, ui-ux-pro-max's design guidance.
4. `/qa` or `/browse` — drive the real app, not just tests.
5. `/review` (or `/code-review` for local-only changes) before calling
   anything done.
6. `/ship` to land and deploy.
7. `/context-save` at milestones; `/context-restore` when picking work back up.

## Entry point

`.claude/skills/hackathon-build/SKILL.md` wires the above together — it
triggers automatically on requests like "build the project," "add a
feature," or "ship this," so you don't need to re-explain the workflow each
time.

## GBrain Configuration (configured by /setup-gbrain)
- Mode: local-stdio
- Engine: pglite
- Config file: ~/.gbrain/config.json (mode 0600)
- Setup date: 2026-07-04
- MCP registered: yes (user scope)
- Artifacts sync: off
- Current repo policy: unset (no git remote yet — re-run `/setup-gbrain --repo` once one is added)

## GBrain Search Guidance (configured by /sync-gbrain)
<!-- gstack-gbrain-search-guidance:start -->

GBrain is set up and synced on this machine. The agent should prefer gbrain
over Grep when the question is semantic or when you don't know the exact
identifier yet.

Prefer gbrain when:
- "Where is X handled?" / semantic intent, no exact string yet:
    `gbrain search "<terms>"` or `gbrain query "<question>"`
- "Where is symbol Y defined?" / symbol-based code questions:
    `gbrain code-def <symbol>` or `gbrain code-refs <symbol>`
- "What calls Y?" / "What does Y depend on?":
    `gbrain code-callers <symbol>` / `gbrain code-callees <symbol>`

Grep is still right for known exact strings, regex, multiline patterns, and
file globs. Run `/sync-gbrain` once this repo has code to index (and again
after adding a remote, to set the repo trust policy).

<!-- gstack-gbrain-search-guidance:end -->
