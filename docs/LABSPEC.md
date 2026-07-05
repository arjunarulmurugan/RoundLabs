# LabSpec v1 (shared contract)

Master prompt §14. Defined once in `src/types/lab-spec.ts`. Reuses
`EvidenceReference` / `ScenarioFact` from `src/types/verified-scenario.ts` — not
duplicated.

## Pipeline (this build)

```
VerifiedScenarioPacket (src/data/verified-scenarios/valorant.ts)
        ↓  buildLabSpec.ts  (deterministic, generationMethod: "verified-prepared")
LabSpec 1.0
        ↓  validateLabSpec.ts + validateProvenance.ts  (controlled ValidationResult)
        ↓  componentRegistry.ts  (10 registered components, no executable UI code)
LabRenderer.tsx  (single shared renderer, no game-specific page hardcoding)
        ↓
Rendered Valorant decision lab
```

## Component registry (10)

`map-board`, `decision-tree`, `timeline`, `risk-reward`, `information-card`,
`alternative-selector`, `telemetry-panel`, `strategy-comparison`, `evidence-panel`,
`drill-card`. AI/analysis may only *select* these; unknown types fail validation.

## Valorant slice uses

`information-card`, `map-board`, `timeline`, `risk-reward`, `alternative-selector`,
`evidence-panel`, `drill-card` (7 of 10). The other 3 (`decision-tree`,
`telemetry-panel`, `strategy-comparison`) are implemented and registered for
later Pokémon/F1 phases.
