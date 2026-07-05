# RoundLabs — Dynamic Software Interface Architecture

One material, many forms. Shared contracts underneath; substantially different
environments on top.

## Flow
```
Neutral clay input (text / image / video / config / source)
        │  recognizeGame() — deterministic, explainable, never claims AI
        ▼
resolveScenario(game, text) — decision model within a game
        │  build LabSpec  (validated + provenance-checked)
        ▼
ClayCompiler transform (~3.5s, skippable, reduced-motion aware)
        │  navigate('#/lab/:id')  — transition begins before the route change
        ▼
LabRenderer + GameShell(profile) → game- & decision-specific composition
```

## Shared (the only things in common across games)
- RoundLabs identity + global nav.
- LabSpec contract · runtime validation · provenance system · component registry ·
  LabRenderer · Player Brain · Save Lesson · View LabSpec · accessibility.

## Different per game (not just colour/labels)
| | Valorant | Pokémon | F1 |
|---|---|---|---|
| Layout | tactical-command | branch-analysis | race-strategy |
| Primary surface | abstract map + config workspace | decision tree | stint timeline + telemetry |
| Terminology | Configuration Diagnosis / Suggested Experiment / Revised Configuration | Turn State / Decision Branches / Projected State | Race State / Strategy Path / Telemetry |
| Reshape on select | map markers + timeline + config emphasis | active branch + projected state | strategy path + telemetry emphasis |

## Config workspace (Valorant)
`iniEditor.ts` (comment/order-preserving parse + isolated edit) + `valorantConfig.ts`
(allow-list, eDPI math that withholds without DPI/target). UI: upload → diff →
download `*.roundlabs.ext`. Original never overwritten, file never executed.

## Missing evidence
`UnfinishedRegion` renders a structurally unformed region (dashed edge, what's
missing / why / still-concluded / action to complete) — not a polished panel with a
badge. Accessible via shape + text.

## Video
`videoAnalysis.ts`: file validation → serverless endpoint (`VITE_VIDEO_ANALYSIS_ENDPOINT`)
→ `validateVideoAnalysisResult` → render; endpoint absent/failing → honest manual
fallback labelled "Manual (no AI claim)". No client secret.

## Routing
Hash router (no dependency) — Pages refresh-safe. Routes: `/`, `/lab/:id`,
`/lessons`, `/valorant/config`; unknown → safe error.

## Runtime independence
Static build runs with no GBrain CLI / PGLite / dev server. GBrain is dev-time
memory only; the browser uses checked-in grammar and scenarios.
