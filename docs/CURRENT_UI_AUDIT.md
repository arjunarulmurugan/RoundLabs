# RoundLabs — Current UI / DSI Audit (pre-transformation)

Method: live browser QA at http://localhost:5178 + source inspection. This is the
`/qa-only` intent (document, do not change). Baseline: 30/30 tests, build passes.

## Confirmed problems (all 12 verified)

1. **Home is a generic SaaS dashboard.** Three environment cards dominate the lower
   half; the page reads as a card grid, not a compiler. — `src/App.tsx` `.environments`.
2. **Selector/detection out-prioritise the compiler.** The game `<select>` and the
   recognition banner sit at the same visual weight as the match-moment textarea.
3. **Generic rounded-card container everywhere.** `.lab-card`, `.environment`,
   `.scenario-input`, `.recent-lessons` all share one rounded-bordered box skeleton.
4. **Only Valorant is complete.** Pokémon and F1 show "Awaiting verified scenario data".
5. **Pokémon/F1 open empty states**, not functional decision labs.
6. **Profiles mostly change decoration.** `gameExperienceProfiles.ts` varies accent,
   pattern, and labels, but the card skeleton and region grid are structurally similar.
7. **Flow is dropdown→prepared content, not material transformation.** Selecting a
   game and clicking opens content; there is no continuous reshape from a neutral state.
8. **Valorant lab reuses the home card skeleton**, just rearranged into a grid.
9. **Evidence is wall cards** ("WHAT WE KNOW", "REPORTED SEQUENCE") detached from the
   spatial surface rather than contextually attached to the map.
10. **Unknowns are segregated** into a separate "UNKNOWN AT THIS MOMENT" card instead
    of showing as unresolved slots inside the decision context.
11. **No interactive decision surface in Valorant beyond the alternative buttons** —
    selecting an alternative changes text but not spatial emphasis, path, timeline
    focus, or drill focus. No visible branch/protocol surface.
12. **`profile: local` tag** reflects checked-in prepared data, not live GBrain
    generation (correct and honest, but must stay clearly labelled after the redesign).

## Transformation targets (what the redesign must achieve)

- One neutral **material** surface that continuously reshapes: input → reading →
  recognise game → recognise decision structure → separate facts/unknowns → select
  tools → reshape → lab. No spinner-then-new-page.
- Compiler (match-moment input) is the visual centre; selector/recent become secondary.
- Provenance and unknowns live *inside* the decision context, not in wall cards.
- Alternative/branch/strategy selection materially changes emphasis, path, timeline,
  evidence, consequence, and drill focus.
- Pokémon and F1 render real (player-report, no-fabricated-number) labs.
- Same game, two decision models (Valorant retake vs economy) → materially different UI.
