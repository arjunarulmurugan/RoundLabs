# Data Provenance Policy (enforced)

Master prompt §10. Enforced in code by `src/lib/compiler/validateProvenance.ts`
and `validateLabSpec.ts`.

## Fact statuses

`observed` · `user-reported` · `source-backed` · `inferred` · `unknown`

## Enforced rules

- Every fact carries a known status; unknown statuses fail validation.
- Every `sourceIds` entry must resolve to a declared `EvidenceReference`.
- `inferred` facts MUST include a numeric `confidence` in 0..1 AND an `explanation`.
- `unknown` facts may not carry a concrete value (no disguising unknowns as facts).
- `observed` / `source-backed` facts must link at least one source (demo-ready labs).
- Demo-ready labs must include ≥1 evidence reference.

## This build's Valorant packet

- Single source: one `player-report` (qualitative account).
- All 6 facts are `user-reported`, each linked to the report. **0 numeric facts.**
- 6 unknowns kept visible (enemies alive, time, economy, HP, teammate arrival, utility).
- `approvedForDemo: false` — pending Yuvaraj's review/approval.
- Assumptions in the analysis layer are labelled as projected, not observed.
