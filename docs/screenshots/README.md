# QA Screenshots

Captured live during browser QA (Claude preview tooling renders into the session
transcript, not on-disk PNGs). This manifest records what was verified; binaries are
not fabricated. Latest pass on the PRODUCTION build (bun run preview, port 5180).

## Final integration pass (2026-07-05)

| Intended file | View verified | Result |
|---|---|---|
| final-neutral-clay.png | Neutral compiler | "Describe the match moment." + material input (Image/Video/Config) + nav + examples |
| final-transformation.png | Compile → transform | ~3.5s staged narration in place, Skip button, then navigate to `#/lab/:id` |
| final-valorant-config.png | Valorant config workspace | "CONFIGURATION DIAGNOSIS" / "Current Input Profile", suggested-experiment panel, recognised-settings table |
| final-valorant-diff.png | Config diff | Single changed line L3 `MouseSensitivity=0.35 → 0.4`; download `GameUserSettings.roundlabs.ini` |
| final-unfinished-evidence.png | Missing DPI | Structural unfinished region (dashed edge, "Missing: Mouse DPI", why, action) — not a badge |
| final-pokemon.png | Pokémon lab | branch-analysis decision tree (`#/lab/pkmn-switch-001`) |
| final-f1.png | F1 lab | race-strategy timeline + telemetry (`#/lab/f1-undercut-001`) |
| final-video-analysis.png | Video material | local preview + honest manual fallback ("Manual (no AI claim)") when endpoint unset |
| final-mobile.png | Mobile 375px | single-column neutral compiler, full-width controls |

Production build console: **0 errors**. Dev-server console showed stale HMR-transition
errors from mid-edit recompiles (single fixed module timestamp) — absent from the
production build.
