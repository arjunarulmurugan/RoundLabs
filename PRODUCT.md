# RoundLabs

> Decision training for competitive games.
> Aim trainers train your hands. RoundLabs trains your decisions.

RoundLabs turns one real competitive-gaming match moment into an evidence-aware
interactive **decision lab**: understand the mistake, compare alternatives with
their consequences and evidence, practise the missing decision skill with one
targeted drill, and save the lesson to Player Brain.

## Supported games (3)
1. Valorant — spatial and tactical decisions (verified lab available)
2. Competitive Pokémon — branching and hidden-information decisions (awaiting verified scenario)
3. F1 racing game — telemetry and strategy decisions (awaiting verified scenario)

Rocket League is not part of the product.

## The Dynamic Software Interface
One match moment becomes the specification. A game-specific decision environment is
compiled from it through a single shared renderer:

```
Scenario input → GameRecognizer → GameRecognitionResult
  → GameExperienceProfile (GBrain-preferred, local fallback)
  → validated LabSpec → shared LabRenderer → game-specific composition
```

Architecture: **3 game environments · 1 shared LabSpec · 1 shared LabRenderer ·
1 safe component registry · game-specific interface manifests.**

## Data-truth policy
No fabricated match events, positions, telemetry, move sets, lap times, or outcomes.
Every fact carries provenance (observed / user-reported / source-backed / inferred /
unknown). Unknowns stay `Unknown`. Recommendations are projected analysis, not
guaranteed outcomes. See `docs/DATA_PROVENANCE.md` and `DESIGN.md`.
