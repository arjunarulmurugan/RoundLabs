import type { LabSpec } from "../../types/lab-spec";
import type { VerifiedScenarioPacket } from "../../types/verified-scenario";

// RoundLabs — Competitive Pokémon scenario (player report). PROVENANCE: a single
// qualitative account of a switching decision. NO hidden moves, items, abilities,
// or damage rolls are invented (master prompt §12.2). approvedForDemo:false.

export const pokemonSwitchScenario: VerifiedScenarioPacket = {
  id: "pkmn-switch-001",
  game: "pokemon",
  title: "Stayed in and attacked instead of preserving the win condition",
  rawPlayerDescription:
    "In a singles game I was ahead. My opponent's lead looked like it was about to set up. Instead " +
    "of switching to keep my sweeper healthy for the endgame, I stayed in and attacked, predicting " +
    "they'd switch. They didn't — they set up and my win condition took a big hit. I don't know their " +
    "exact item or hidden moves, but I lost the piece that would have won me the game.",
  evidence: [
    {
      id: "ev-pkmn-report",
      sourceType: "player-report",
      title: "Player's account of the switching decision",
      reporter: "pending-review",
      timestampOrLocation: "Mid-game, player ahead",
      notes: "Qualitative only. Opponent's exact moves, item, and ability are unknown.",
    },
  ],
  facts: [
    { id: "pf-lead", label: "Game state", value: "Player ahead", status: "user-reported", sourceIds: ["ev-pkmn-report"] },
    { id: "pf-threat", label: "Opponent lead", value: "Looked about to set up", status: "user-reported", sourceIds: ["ev-pkmn-report"] },
    { id: "pf-wincon", label: "Win condition", value: "Player's sweeper (needed healthy for endgame)", status: "user-reported", sourceIds: ["ev-pkmn-report"] },
    { id: "pf-action", label: "Action taken", value: "Stayed in and attacked, predicting a switch", status: "user-reported", sourceIds: ["ev-pkmn-report"] },
    { id: "pf-outcome", label: "Outcome", value: "Opponent set up; win condition took a big hit", status: "user-reported", sourceIds: ["ev-pkmn-report"] },
  ],
  unknowns: [
    "Opponent's held item",
    "Opponent's exact moveset and hidden moves",
    "Opponent's ability",
    "Exact HP / damage rolls",
    "Whether the opponent would have switched",
  ],
  approvedForDemo: false,
};

export function buildPokemonSwitchLabSpec(): LabSpec {
  return {
    version: "1.0",
    id: `lab-${pokemonSwitchScenario.id}`,
    game: "pokemon",
    gameLabel: "Competitive Pokémon",
    title: pokemonSwitchScenario.title,
    generationMethod: "verified-prepared",
    sourceInput: pokemonSwitchScenario.rawPlayerDescription,
    playerGoal: "Convert a lead into a win by preserving the win condition into the endgame.",
    situationSummary:
      "Player ahead; opponent's lead looked about to set up. The player stayed in and attacked on a prediction rather than switching to preserve the sweeper, and the win condition took a big hit.",
    mistakeCategory: "Win-condition preservation / prediction risk",
    decisionQuestion:
      "With a lead and your win condition on the field against a possible setup, do you stay in and predict, switch to preserve it, or pivot safely?",
    evidence: pokemonSwitchScenario.evidence,
    facts: pokemonSwitchScenario.facts,
    unknowns: pokemonSwitchScenario.unknowns,
    assumptions: [
      "The opponent's lead was genuinely a setup threat. (Their moveset is unknown.)",
      "The sweeper was the only realistic win condition. (Team details are unknown.)",
    ],
    components: [
      { id: "cp-tree", type: "decision-tree", title: "Decision branches", order: 1, region: "primary", data: {
        branches: [
          { id: "b1", choice: "Stay in and attack (predict switch)", projectedConsequence: "If they switch you gain tempo; if they set up your win condition is damaged (what happened)", children: [
            { id: "b1a", choice: "They set up", projectedConsequence: "Win condition takes a big hit" },
            { id: "b1b", choice: "They switch", projectedConsequence: "You gain tempo" },
          ] },
          { id: "b2", choice: "Switch to preserve the sweeper", projectedConsequence: "Keep your win condition healthy for the endgame; concede some short-term tempo" },
          { id: "b3", choice: "Pivot safely into a check", projectedConsequence: "Absorb the setup with a resist and keep the win condition in reserve" },
        ],
      } },
      { id: "cp-info", type: "information-card", title: "Revealed & hidden information", order: 2, region: "primary", data: { showUnknowns: true } },
      { id: "cp-risk", type: "risk-reward", title: "Risk vs reward", order: 3, data: {} },
      { id: "cp-alts", type: "alternative-selector", title: "Decision branches", order: 4, data: {} },
      { id: "cp-ev", type: "evidence-panel", title: "Revealed information", order: 5, data: {} },
      { id: "cp-drill", type: "drill-card", title: "Practice sequence", order: 6, data: {} },
    ],
    alternatives: [
      { id: "pk-alt-stay", label: "Stay in and predict (the play made)", summary: "Attack, betting they switch.", risk: "very-high", reward: "moderate", rating: "critical-error",
        consequence: "If they set up rather than switch, your win condition is damaged — the reported outcome.",
        reasoning: "Predicting a switch risks your win condition on a coin-flip when you're already ahead; the downside (losing the piece that wins) outweighs the tempo upside.",
        supportingFactIds: ["pf-action", "pf-outcome", "pf-wincon"], assumptions: [] },
      { id: "pk-alt-switch", label: "Switch to preserve the win condition", summary: "Keep the sweeper healthy for the endgame.", risk: "low", reward: "high", rating: "recommended",
        consequence: "You concede minor tempo but carry a healthy win condition into an endgame you're already favoured to win.",
        reasoning: "When ahead, preserving your win condition converts the lead; you don't need to gamble it against an unknown setup.",
        supportingFactIds: ["pf-lead", "pf-wincon"], assumptions: ["The sweeper is the real win condition."] },
      { id: "pk-alt-pivot", label: "Pivot into a check", summary: "Bring in a resist to absorb the setup.", risk: "moderate", reward: "high", rating: "viable",
        consequence: "You blunt the setup and keep the win condition in reserve, at the cost of revealing the check.",
        reasoning: "A safe pivot answers the threat without risking the win condition, trading a little information for board control.",
        supportingFactIds: ["pf-threat", "pf-wincon"], assumptions: ["A suitable check is available (team unknown)."] },
    ],
    recommendedAlternativeId: "pk-alt-switch",
    drill: {
      id: "pk-drill", title: "Win-condition preservation drill",
      objective: "Train the reflex to identify and protect your win condition before making a prediction.",
      steps: [
        "Before each risky turn, name your win condition out loud.",
        "Ask: 'Does this turn risk my win condition? What happens if my prediction is wrong?'",
        "If being wrong damages the win condition and you're ahead, default to switching or pivoting.",
        "Only predict when the downside does not touch your win condition.",
      ],
      successCriterion: "Across 10 decisions you name the win condition first and avoid risking it on a prediction while ahead.",
    },
    memorySummary:
      "Stayed in to predict a switch and my win condition got set up on. Better: switch or pivot to preserve the sweeper when ahead — don't gamble the piece that wins. Cue: 'name the win condition before you predict.'",
  };
}
