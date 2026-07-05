# RoundLabs — Design Source of Truth

## Shared renderer rule
One `LabSpec` contract → one `LabRenderer` → one safe component registry → one
validation pipeline. There are **no per-game page components**. Game identity is
expressed by a declarative **Game Experience Manifest** (`src/config/
gameExperienceProfiles.ts`) applied through `GameShell`. Adding/altering a game is
a manifest change, not a new application.

## Three supported games
Valorant, Competitive Pokémon, F1 racing game. (Rocket League removed.)

Architecture claim:
```
3 game environments
1 shared LabSpec
1 shared LabRenderer
1 safe component registry
Game-specific interface manifests
```

## Recognition flow
`recognizeGame()` order: explicit selection → evidence metadata → filename →
deterministic keyword terms → (ai-assisted branch, unwired) → confirmation on
ambiguity. Confidence = topScore/(topScore+secondScore) from matched distinct
keywords — never fabricated. `requiresConfirmation` when no match, tie, or
confidence < 0.6. The UI explanation never claims AI when matching was deterministic.

## GBrain's retrieval role
GBrain stores recognition vocabulary, experience profiles, and design decisions
(`roundlabs-*` nodes). It is retrieval memory, **not** the game identifier.

## Local profile fallback
Checked-in profiles are the reliable fallback. `loadGameProfile()` prefers GBrain
and reports its source truthfully (`gbrain` | `local-fallback`); a GBrain outage
never blocks the UI.

## Experience grammars
- **Valorant — tactical-command**: map-dominant two-region command room (wide
  primary + intel rail), dense, angular clipped map panel, uppercase mono tactical
  labels, accent #ff5470. Primary: map-board, timeline, alternative-selector.
- **Pokémon — branch-analysis**: open/airy centered single-column primary with a
  supporting grid below, rounded roomy cards, sans type, accent #7c9cff. Primary:
  decision-tree, alternative-selector. Clear known vs hidden separation.
- **F1 — race-strategy**: data-dense horizontal 3-panel primary strip + dense
  supporting grid, tabular mono numerics, accent #ffb020. Primary: timeline,
  telemetry-panel, strategy-comparison. Unknown telemetry shown as `Unknown`.

## Accessibility constraints
Contrast ≥4.5:1 body; provenance encoded by **glyph + text + colour** (● observed,
◆ sourced, ▲ reported, ∿ inferred, ? unknown) — never colour alone; visible
`:focus-visible` rings; ≥44px touch targets; `prefers-reduced-motion` honoured;
responsive at 980/680px; semantic labels/regions.

## Forbidden generic-AI patterns
Equal identical rounded card grids; gradients/glassmorphism everywhere; giant empty
hero; decorative meaningless charts; random glowing borders; emoji as primary icons;
every section in the same container shape; status-pill overload; colour as the only
provenance signal; tiny low-contrast metadata; generic "AI-powered" marketing copy.
