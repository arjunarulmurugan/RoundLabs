# RoundLabs — Digital Clay Design System

## Office-hours answer (the product question, unchanged idea)
> "What visible product behaviour makes a judge immediately understand the interface
> behaves like digital clay rather than three themed dashboards?"

**Answer:** A single neutral surface that, after the user describes one match moment,
**visibly reshapes itself in place** — same container, no navigation, no spinner-then-
new-page — through a short continuous sequence (reading → recognising the game →
recognising the decision structure → separating facts from unknowns → selecting
reasoning tools → reshaping) and settles into a game- and decision-specific lab. The
judge sees *one material becoming the right instrument*, and then sees that the *same
game with a different decision model becomes a different instrument*.

Implementation of that answer:
1. The compiler (match-moment input) is the centre of the product, not a card grid.
2. `ClayCompiler` runs an in-place morph: the neutral surface stays mounted and its
   CSS grid/tokens interpolate into the resolved lab. No route change.
3. Selecting an alternative/branch/strategy re-emphasises the *same* surface.
4. Two Valorant decision models (retake vs economy) resolve to materially different
   compositions from identical machinery.

## Autoplan (Reduction-biased — no new frameworks/deps, reuse machinery)
- **Reuse**, don't rebuild: existing LabSpec, validation, provenance, registry,
  LabRenderer, Player Brain, GameShell, recognizer, manifests all stay.
- **Add small**: one `ClayCompiler` state machine, one scenario registry, three
  player-report scenario packets (pokemon, f1, valorant-economy), CSS material tokens.
- **Cut**: the equal three-card grid as the central experience (demoted to subtle
  examples); the separate empty-state pages become a fallback, not the main path.
- No backend, no Redux, no router, no canvas, no charts. React state + CSS + SVG only.

## The neutral material
- One surface, one token set. Neutral = low-chroma slate, unset accent, dashed/soft
  edges, generous space, a faint grid that reads as "unformed clay".
- Tokens (CSS custom properties on `:root`, overridden per game by `GameShell`):
  `--clay-surface`, `--clay-edge`, `--clay-accent` (unset/neutral in the neutral state),
  `--clay-grid`, plus the existing `--game-*` tokens for the resolved state.
- Type scale 12/14/16/18/24/32; 4/8 spacing; tabular numerics for data.

## Game transformation rules
| Game | Character | Layout grammar | Accent |
|---|---|---|---|
| Valorant | Spatial tactical planning under pressure | map-dominant primary + intel rail; angular, compact | #ff5470 |
| Pokémon | Living strategic decision tree | branching centred column; open, organic, future-state | #7c9cff |
| F1 | Race-engineering workstation | horizontal stint strip + dense data grid; technical | #ffb020 |

## Scenario-level transformation rules
The manifest is not the only driver — the **decision model** re-weights components:
- Valorant *retake* → map/timeline/utility dominate (spatial emphasis).
- Valorant *economy* → decision-tree/resources/round-horizon dominate; **map demoted**.
- Selecting an alternative sets an **emphasis key** that the renderer applies to the
  surface (`data-emphasis`) so spatial focus, path, timeline, evidence, and drill shift.

## Motion & accessibility
- Transformation ≤ ~1.6s total, staged; uses opacity/transform only; interruptible.
- `prefers-reduced-motion`: stages collapse to an instant labelled state change (the
  same steps are shown as a static list, no animation).
- Visible focus rings; ≥44px targets; provenance = glyph + text + colour (never colour
  only); unknowns rendered as explicit unresolved slots, not hidden.

## Forbidden (generic-AI / off-brand)
Equal card grids as the hero; gradients/glass everywhere; giant empty hero; decorative
meaningless charts; emoji icons; colour-only provenance; Riot/Pokémon/F1 official
assets, maps, sprites, logos, fonts, or broadcast overlays. Original abstract shapes only.

## Honest data & deploy note
Pokémon/F1/economy scenarios are **player-report** accounts: qualitative facts only,
**zero fabricated numbers**, numeric fields `Unknown`, `approvedForDemo: false` pending
approval. GitHub Pages runs the checked-in local grammar; it does **not** execute the
GBrain CLI. GBrain is used in development for memory only.
