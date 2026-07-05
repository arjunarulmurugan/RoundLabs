# Final Integration — Baseline QA (before any code change)

`/qa-only` intent: document current behaviour, change nothing. Captured 2026-07-05.
Baseline gates: typecheck PASS, 36/36 tests PASS, build PASS.

## Works today (preserve)
- Neutral clay compiler is the centre; "Describe the match moment." dominant.
- In-place staged transformation → lab (no navigation, no spinner-then-page).
- Deterministic recognition (never claims AI); explainable matched terms.
- Three game labs render real player-report scenarios: Valorant retake (tactical map),
  Pokémon switch (branch tree), F1 undercut (telemetry with Unknown fields).
- Same-game proof: Valorant retake (map-dominant) vs economy (tree, no map).
- Alternative selection changes reasoning + lights map markers + timeline events.
- Save Lesson (honest local-only), View LabSpec, mobile single-column, 0 console errors.

## Gaps vs this phase's requirements
| Area | State |
|---|---|
| Text input | Works |
| Image input | **Missing** |
| Video input / preview / analysis | **Missing** |
| Config-file input + editor | **Missing** |
| Source/reporter field | Present (optional text) |
| Routing (/, /lab/:id, /lessons) | **Missing** (state-only phases) |
| Transformation duration | ~1.6s (**below 3–5s target**), no Skip |
| Missing-evidence treatment | Badge/"Unknown" only — **not structurally unfinished** |
| Valorant as config/tactical workspace | Tactical only — **no config workspace** |
| Video-analysis endpoint / .env.example | **Missing** |
| Deploy: .env.example, deploy-pages.yml, ARJUN_GITHUB_HANDOFF.md | **Missing** |

## No-fix rule honoured
No code changed during this baseline capture.
