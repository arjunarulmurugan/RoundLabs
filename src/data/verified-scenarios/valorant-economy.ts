import type { LabSpec } from "../../types/lab-spec";
import type { VerifiedScenarioPacket } from "../../types/verified-scenario";

// RoundLabs — Valorant ECONOMY scenario (player report). Same game as the retake
// scenario, but a DIFFERENT decision model. Its components declare region:"primary"
// on the decision-tree + resources so the shared renderer composes it as an
// economic branch analysis — the map does NOT dominate. This is the Phase 7 proof:
// same game + different decision model → materially different interface.
// Qualitative only; no fabricated economy numbers. approvedForDemo:false.

export const valorantEconomyScenario: VerifiedScenarioPacket = {
  id: "val-economy-001",
  game: "valorant",
  title: "Force-bought on a save round and broke the team economy",
  rawPlayerDescription:
    "We lost the pistol and the first gun round. It was a save round — most of us were low on credits. " +
    "I forced a rifle anyway because I wanted the round, we lost it, and then the whole team was broke " +
    "for two more rounds. I don't have exact credit numbers, it just clearly wrecked our buys.",
  evidence: [
    {
      id: "ev-val-eco-report",
      sourceType: "player-report",
      title: "Player's account of the economy decision",
      reporter: "pending-review",
      timestampOrLocation: "Early half, after losing pistol + first gun round",
      notes: "Qualitative only. Exact credit totals for player and team are unknown.",
    },
  ],
  facts: [
    { id: "ef-state", label: "Economic state", value: "Save round after two losses", status: "user-reported", sourceIds: ["ev-val-eco-report"] },
    { id: "ef-team", label: "Team credits", value: "Most players low", status: "user-reported", sourceIds: ["ev-val-eco-report"] },
    { id: "ef-action", label: "Action taken", value: "Force-bought a rifle alone", status: "user-reported", sourceIds: ["ev-val-eco-report"] },
    { id: "ef-outcome", label: "Outcome", value: "Lost the round; team broke for two more rounds", status: "user-reported", sourceIds: ["ev-val-eco-report"] },
  ],
  unknowns: [
    "Exact credit totals for the player and each teammate",
    "Whether teammates intended to save or force together",
    "Enemy economy and expected buy",
    "Loss-bonus tier at this point",
  ],
  approvedForDemo: false,
};

export function buildValorantEconomyLabSpec(): LabSpec {
  return {
    version: "1.0",
    id: `lab-${valorantEconomyScenario.id}`,
    game: "valorant",
    gameLabel: "Valorant",
    title: valorantEconomyScenario.title,
    generationMethod: "verified-prepared",
    sourceInput: valorantEconomyScenario.rawPlayerDescription,
    playerGoal: "Win the map by keeping a healthy economy so the team can full-buy on strong rounds.",
    situationSummary:
      "After losing the pistol and first gun round on a save, the player force-bought a rifle alone, lost the round, and left the team broke for two more rounds.",
    mistakeCategory: "Economy decision / buy consistency",
    decisionQuestion:
      "On a save round with low team credits, should you force alone, save with the team, or coordinate a team force?",
    evidence: valorantEconomyScenario.evidence,
    facts: valorantEconomyScenario.facts,
    unknowns: valorantEconomyScenario.unknowns,
    assumptions: [
      "A coordinated save would have enabled a full-buy within two rounds. (Exact credits and loss-bonus tier are unknown.)",
    ],
    components: [
      // Decision-tree and resources are PRIMARY here — the map is intentionally absent.
      { id: "ce-tree", type: "decision-tree", title: "Economic decision tree", order: 1, region: "primary", data: {
        branches: [
          { id: "eb1", choice: "Force-buy alone (the play made)", projectedConsequence: "Likely lose the round outgunned and stay broke (what happened)", children: [
            { id: "eb1a", choice: "Lose round", projectedConsequence: "Broke for ~2 more rounds" },
            { id: "eb1b", choice: "Win round", projectedConsequence: "Small swing, still thin economy" },
          ] },
          { id: "eb2", choice: "Save with the team", projectedConsequence: "Concede this round; guarantee a coordinated full-buy soon" },
          { id: "eb3", choice: "Coordinate a team force", projectedConsequence: "All-in together for a chance to break enemy economy — high variance" },
        ],
      } },
      { id: "ce-info", type: "information-card", title: "Team resources & round horizon", order: 2, region: "primary", data: { showUnknowns: true } },
      { id: "ce-risk", type: "risk-reward", title: "Risk vs reward", order: 3, data: {} },
      { id: "ce-alts", type: "alternative-selector", title: "Economic options", order: 4, data: {} },
      { id: "ce-ev", type: "evidence-panel", title: "Evidence & provenance", order: 5, data: {} },
      { id: "ce-drill", type: "drill-card", title: "Training protocol", order: 6, data: {} },
    ],
    alternatives: [
      { id: "eco-alt-force", label: "Force-buy alone (the play made)", summary: "Buy a rifle by yourself on the save.", risk: "very-high", reward: "low", rating: "critical-error",
        consequence: "You're likely outgunned, lose the round, and leave the team broke for two more rounds — the reported outcome.",
        reasoning: "A solo force spends credits the team needs without the numbers to win; the expected value is negative because it deepens the economic hole.",
        supportingFactIds: ["ef-action", "ef-outcome", "ef-team"], assumptions: [] },
      { id: "eco-alt-save", label: "Save with the team", summary: "Concede the round, buy properly next round.", risk: "low", reward: "high", rating: "recommended",
        consequence: "You give up one round but guarantee a coordinated full-buy, which converts to round wins more reliably.",
        reasoning: "Buy consistency wins halves: a disciplined save preserves credits so the team full-buys together on a strong round.",
        supportingFactIds: ["ef-state", "ef-team"], assumptions: ["A full-buy is reachable within two rounds."] },
      { id: "eco-alt-teamforce", label: "Coordinate a team force", summary: "Everyone forces together this round.", risk: "high", reward: "moderate", rating: "viable",
        consequence: "A synchronized force can break the enemy economy if it hits, but risks a deeper hole if it misses.",
        reasoning: "If the team forces together the numbers are even and a win swings both economies; alone it cannot — coordination is the deciding factor.",
        supportingFactIds: ["ef-state", "ef-team"], assumptions: ["Teammates have enough to force meaningfully (unknown)."] },
    ],
    recommendedAlternativeId: "eco-alt-save",
    drill: {
      id: "eco-drill", title: "Buy-discipline protocol",
      objective: "Train the habit of making the buy call with the team, not alone.",
      steps: [
        "At the start of each buy phase, check the team economy before your own.",
        "State the plan out loud: 'full-buy', 'save', or 'team force' — one call for everyone.",
        "Never solo-force on a save unless it's an agreed team force.",
        "Review whether your buys stayed consistent across the half.",
      ],
      successCriterion: "Across a half you make zero solo forces on save rounds and align your buy with the team every round.",
    },
    memorySummary:
      "Solo force-bought on a save and left the team broke for two rounds. Better: save with the team for a coordinated full-buy, or force only as an agreed team. Cue: 'check team economy, make one buy call.'",
  };
}
