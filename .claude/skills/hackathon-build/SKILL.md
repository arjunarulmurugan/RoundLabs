---
name: hackathon-build
description: "Orchestrates this project's build workflow, driven primarily by gstack (spec/plan/qa/review/ship) and gbrain (memory/search/decision log) per hackathon requirements, with ponytail's minimalism ladder, ui-ux-pro-max's design intelligence, and ECC's TDD/review rules as supporting layers. Use whenever asked to build, add, fix, or ship something in this project."
triggers:
  - build the project
  - add a feature
  - ship this
  - implement this
  - start building
---

## When to invoke this skill

Whenever asked to build, extend, fix, or ship anything in this repo. This
skill doesn't do the work itself — it's a checklist for which tool to reach
for at each step so the workflow stays consistent across the team.

**Hackathon requirement:** gstack and gbrain are the primary tools for this
project, not optional extras. Default to a gstack skill over an ad-hoc
approach whenever one fits, and route memory/search through gbrain instead
of ad-hoc note-taking or plain Grep. Everything else below (ponytail,
ui-ux-pro-max, ECC rules) shapes *how* code and design decisions get made
once gstack/gbrain have framed *what* to build — they don't replace the
gstack/gbrain-driven flow.

## Before first use on a machine

1. Confirm gbrain is initialized and registered as an MCP server. If unsure,
   run `/setup-gbrain`. Once there's code to index, run `/sync-gbrain`.
2. Confirm ponytail is installed as a plugin (`/plugin marketplace add
   DietrichGebert/ponytail` then `/plugin install ponytail@ponytail`, in two
   separate turns). If it isn't installed, apply its minimalism ladder
   manually anyway (see below) — the discipline doesn't require the plugin.

## Steps

1. **Shape it with gstack first.** Run `/office-hours` or `/spec` to turn a
   vague ask into a concrete requirement before touching code. Don't skip
   this because the task "seems obvious" — that's when scope drifts.

2. **Plan and log the decision.** Run `/plan` or `/plan-eng-review` to lock
   the architecture. Log durable calls (architecture, scope, tool/vendor
   choice, reversals) with `gstack-decision-log` as they're made — this is
   the audit trail judges and teammates see, not just the final diff.

3. **Search gbrain before Grep.** Once this repo has code, `gbrain search
   "<terms>"` or `gbrain code-def/code-refs/code-callers <symbol>` answers
   semantic and symbol questions faster than grepping cold; see the
   `## GBrain Search Guidance` block in the top-level `CLAUDE.md`.

4. **Write the test first.** Follow `.claude/rules/ecc/common/testing.md`
   (RED → GREEN → REFACTOR). Use the language-specific test conventions under
   `.claude/rules/ecc/<language>/testing.md` once the stack is chosen.

5. **Implement with the ponytail ladder.** Before adding any code, in order:
   - Does this need to exist at all? (YAGNI — if no, stop.)
   - Is it already in this codebase? Reuse it.
   - Does the language stdlib do it?
   - Does the browser/platform do it natively?
   - Is it something already in `package.json` / installed deps?
   - Can it be written in one line?
   Only write more than that once every rung above is genuinely exhausted.
   Never cut validation, error handling, security, or accessibility to stay
   terse — the goal is necessary code, not golfed code.

6. **Anything visual, use ui-ux-pro-max.** For pages, components, color/type
   systems, layout, or a visual/accessibility review, let
   `.claude/skills/ui-ux-pro-max/` (plus `design`, `design-system`,
   `ui-styling`, `brand`) inform the choice — it auto-triggers on UI-shaped
   requests, so don't hand-roll a color palette or font pairing when it has
   a searchable database for that. Don't let the ponytail ladder above
   justify skipping accessibility or visual polish — "one line" is about
   avoiding unnecessary code, not shipping unstyled or inaccessible UI.

7. **QA the real thing with gstack.** Use `/browse` or `/qa` to drive the
   actual app rather than trusting tests alone.

8. **Review before calling it done.** Run `/review` for a PR (or
   `/code-review` for local-only changes). Address CRITICAL/HIGH findings
   before moving on, per `.claude/rules/ecc/common/code-review.md`.

9. **Ship with gstack.** Use `/ship` to land and deploy once review and QA
   are clean.

10. **Checkpoint through gbrain.** At real milestones, run `/context-save`
    so progress lives in gbrain artifacts and is recoverable with
    `/context-restore` — not just in git history.

## Notes

- This file assumes the ECC rules vendored into `.claude/rules/ecc/` are
  current. If the project's stack changes, update which language
  subdirectory is vendored (see the top-level `CLAUDE.md`).
- Don't duplicate the detailed rules here — this skill is the map,
  `.claude/rules/ecc/` and gbrain's own memory are the territory.
