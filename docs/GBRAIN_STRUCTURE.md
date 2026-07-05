# GBrain Structure

Master prompt §21. `gbrain` CLI v0.42.55.0 is installed at `~/.bun/bin/gbrain`.

## Status (2026-07-05, three-game phase — RESOLVED)

- Root cause of the earlier "lock": a running `gbrain serve` process holds the
  PGLite connection, so the **CLI** `search/query/put` contend and time out. The
  **GBrain MCP server is the serve process**, so routing writes through the
  `mcp__gbrain__*` tools succeeds without any lock conflict.
- Written via MCP this phase (all `status: created_or_updated`):
  `roundlabs-game-recognition-rules`, `roundlabs-valorant-experience-profile`,
  `roundlabs-pokemon-experience-profile`, `roundlabs-f1-experience-profile`,
  `roundlabs-ui-design-decisions`, `roundlabs-current-integration-state`.
- `write_through` reports `no_repo_configured` (brain has no repo bound) — pages are
  stored in the brain, just not mirrored to a git repo. Not an error for our use.
- Runtime app still uses local checked-in profiles + LocalPlayerBrain; it never
  blocks on GBrain and never claims a GBrain read/write it did not make.

## Required nodes (to create when the lock clears)

```
roundlabs-product-truth            # RoundLabs / Product Truth
roundlabs-labspec-v1               # RoundLabs / LabSpec v1
roundlabs-data-provenance-policy   # RoundLabs / Data Provenance Policy
roundlabs-component-registry       # RoundLabs / Component Registry
roundlabs-verified-scenario-packets# RoundLabs / Verified Scenario Packets
roundlabs-current-integration-state# RoundLabs / Current Integration State
roundlabs-claude-code-handoffs     # RoundLabs / Claude Code Handoffs
roundlabs-validation-results       # RoundLabs / Validation Results
```

## Player Brain memory architecture (planned)

```
PlayerBrain interface        (src/lib/memory/playerBrain.ts)        ✅ done
        ↓
GBrainPlayerBrain            (not yet wired — blocked by PGLite lock)
        ↓
LocalPlayerBrain fallback    (src/lib/memory/localPlayerBrain.ts)   ✅ done, honest "local-only" sync state
```

If GBrain fails at runtime, save locally and show honest sync state — never claim a
successful GBrain write. This is already how `LocalPlayerBrain` behaves.
