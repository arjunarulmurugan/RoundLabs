# RoundLabs — Tasks

## Done
- [x] Phase 1: shared contracts (VerifiedScenarioPacket, LabSpec), validation, provenance
- [x] Phase 2: Valorant verified vertical slice (evidence, alternatives, drill, Player Brain, timer)
- [x] Three-game scope: removed Rocket League; product is Valorant / Pokémon / F1
- [x] Game recognition layer (deterministic, testable, explainable, no fabricated confidence)
- [x] Game experience manifests + GameShell (tactical-command / branch-analysis / race-strategy)
- [x] Shared LabRenderer consumes manifests (primary/secondary regions, per-game labels/theme)
- [x] Polished game-specific insufficient-evidence states for Pokémon and F1
- [x] Home-screen redesign: three-environment selector + scenario input + recognition
- [x] GBrain nodes written via MCP (recognition rules, 3 profiles, UI decisions, integration state)
- [x] 30/30 tests pass; production build passes; live browser QA (desktop + mobile), no console errors

## Done — Digital Clay phase
- [x] Home is a neutral compiler that reshapes in place (no page nav / no spinner)
- [x] Staged transformation narration from real data; reduced-motion path
- [x] All three games render real player-report labs (no fabricated numbers)
- [x] Same-game proof: Valorant retake (map-dominant) vs economy (tree, no map)
- [x] Alternative selection changes spatial (map) + temporal (timeline) emphasis
- [x] `LabComponentSpec.region` override for decision-model composition
- [x] Deploy prepared (vite base, Pages workflow, .nojekyll) — NOT published
- [x] ARJUN_HANDOFF.md; dead home CSS removed; 36/36 tests; build passes

## Next
- [ ] Verified Pokémon scenario packet (real sourced turn) → branch-analysis full lab
- [ ] Verified F1 scenario packet (sourced telemetry) → race-strategy full lab; unknowns stay Unknown
- [ ] Phase 6: natural-language compiler (live AI generation, 1 repair, controlled insufficiency)
- [ ] Phase 7: BENCHMARK.md (processing timer already measured; add manual baseline + pilot)
- [ ] Wire GBrainPlayerBrain over the live MCP server (Player Brain currently local fallback)

## Decisions pending (Yuvaraj)
- [ ] Approve or replace the Valorant scenario packet (`approvedForDemo: false`)
