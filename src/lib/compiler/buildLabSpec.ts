// RoundLabs — deterministic LabSpec builder for verified/prepared packets.
//
// This is NOT live AI generation (out of scope for this slice). It deterministically
// wraps a VerifiedScenarioPacket with a prepared analysis layer: the decision
// framing, alternatives, a drill, and component arrangement.
//
// The analysis (reasoning / consequences / recommendation) is PROJECTED ANALYSIS
// derived from the reported facts — it is not presented as observed match data.
// Every alternative links back to packet fact ids. Unknowns from the packet are
// carried through verbatim. No numeric match facts are invented (master prompt §10).

import type { LabSpec } from "../../types/lab-spec";
import { valorantRetakeScenario } from "../../data/verified-scenarios/valorant";

type PreparedAnalysis = Omit<
  LabSpec,
  | "version"
  | "id"
  | "game"
  | "gameLabel"
  | "title"
  | "generationMethod"
  | "evidence"
  | "facts"
  | "unknowns"
> & { gameLabel: string };

// Prepared analysis for the Valorant A-site retake packet.
function valorantRetakeAnalysis(): PreparedAnalysis {
  return {
    gameLabel: "Valorant",
    sourceInput: valorantRetakeScenario.rawPlayerDescription,
    playerGoal: "Win the round by defusing the spike or eliminating attackers on retake.",
    situationSummary:
      "Last player alive on defense after a plant on A. A teammate is reportedly rotating. " +
      "The player pushed onto site alone and died before achieving a trade or defuse.",
    mistakeCategory: "Retake timing / trading discipline",
    decisionQuestion:
      "As the last player alive post-plant with a teammate rotating, should you push the site alone or hold for a coordinated retake?",

    assumptions: [
      "The rotating teammate would have arrived in time to contribute to a coordinated retake. (Reported en route; arrival time is unknown.)",
      "Enough time remained on the spike for a delayed retake. (Time remaining is unknown.)",
    ],

    components: [
      {
        id: "c-info",
        type: "information-card",
        title: "What we know",
        order: 1,
        width: "full",
        data: { showUnknowns: true },
      },
      {
        id: "c-map",
        type: "map-board",
        title: "Spatial picture (reported, not tracked)",
        order: 2,
        width: "half",
        data: {
          mapLabel: "A site (reported)",
          markers: [
            { id: "m-self", label: "You", area: "A Main", status: "user-reported", x: 24, y: 44, kind: "self", highlightForAltIds: ["alt-solo-push", "alt-play-time"] },
            { id: "m-spike", label: "Spike", area: "A site", status: "user-reported", x: 40, y: 24, kind: "objective", highlightForAltIds: ["alt-solo-push", "alt-hold-together", "alt-play-time"] },
            { id: "m-mate", label: "Rotator", area: "unknown route", status: "user-reported", x: 82, y: 40, kind: "ally", highlightForAltIds: ["alt-hold-together"] },
          ],
          note: "Abstract positions from the player's account. Exact coordinates are unknown. Selecting an option lights the relevant positions.",
        },
      },
      {
        id: "c-timeline",
        type: "timeline",
        title: "Reported sequence",
        order: 3,
        width: "half",
        data: {
          events: [
            { id: "t1", label: "Teammate dies on A Main", status: "user-reported" },
            { id: "t2", label: "You are last alive; spike planted", status: "user-reported" },
            { id: "t3", label: "Teammate begins rotating (arrival time unknown)", status: "user-reported", highlightForAltIds: ["alt-hold-together"] },
            { id: "t4", label: "You push onto site via Main alone", status: "user-reported", highlightForAltIds: ["alt-solo-push"] },
            { id: "t5", label: "You die before trade or defuse", status: "user-reported", highlightForAltIds: ["alt-solo-push"] },
          ],
        },
      },
      {
        id: "c-risk",
        type: "risk-reward",
        title: "Risk vs reward",
        order: 4,
        width: "full",
        data: {},
      },
      {
        id: "c-alts",
        type: "alternative-selector",
        title: "Compare the decisions",
        order: 5,
        width: "full",
        data: {},
      },
      {
        id: "c-evidence",
        type: "evidence-panel",
        title: "Evidence & provenance",
        order: 6,
        width: "full",
        data: {},
      },
      {
        id: "c-drill",
        type: "drill-card",
        title: "Targeted drill",
        order: 7,
        width: "full",
        data: {},
      },
    ],

    alternatives: [
      {
        id: "alt-solo-push",
        label: "Push site alone (the play made)",
        summary: "Enter the site immediately by yourself to contest the defuse.",
        risk: "very-high",
        reward: "low",
        rating: "critical-error",
        consequence:
          "You enter outnumbered with no trade support and are likely traded before defusing — which is what was reported.",
        reasoning:
          "As the last player alive, a solo entry gives attackers a free hold; there is no teammate present to trade your death, so even a successful pick rarely converts into a defuse.",
        supportingFactIds: ["f-last-alive", "f-action-taken", "f-outcome"],
        assumptions: [],
      },
      {
        id: "alt-hold-together",
        label: "Hold for a coordinated retake",
        summary: "Delay, gather with the rotating teammate, then retake together with trades set up.",
        risk: "moderate",
        reward: "high",
        rating: "recommended",
        consequence:
          "You retake with trade potential and shared utility, converting picks into a defuse far more often — provided time and the teammate's arrival allow it.",
        reasoning:
          "Numbers and trades win retakes. Waiting for the rotating teammate turns a 1-vs-many into a coordinated entry where each pick can be traded, which is the higher-expected-value line when time permits.",
        supportingFactIds: ["f-last-alive", "f-teammate-rotating", "f-spike"],
        assumptions: [
          "Teammate arrives in time.",
          "Enough time remains on the spike.",
        ],
      },
      {
        id: "alt-play-time",
        label: "Play for a late solo pick / time",
        summary:
          "Use remaining time to isolate one duel from an off-angle rather than pushing straight in.",
        risk: "high",
        reward: "moderate",
        rating: "viable",
        consequence:
          "You may grab an isolated pick that opens a delayed defuse, but a wrong read still loses the round with no trade.",
        reasoning:
          "If a coordinated retake is impossible (teammate too far, low time), forcing one favourable isolated duel is better than a blind entry — but it remains a solo line with no trade insurance.",
        supportingFactIds: ["f-last-alive", "f-spike"],
        assumptions: ["A favourable off-angle duel is available."],
      },
    ],
    recommendedAlternativeId: "alt-hold-together",

    drill: {
      id: "drill-retake-timing",
      title: "Last-alive retake decision drill",
      objective:
        "Train the reflex to check for trade support and time before committing to a post-plant entry.",
      steps: [
        "In a custom or deathmatch setting, plant the spike and stand as the last defender.",
        "Before every entry, say out loud: 'Is a teammate close enough to trade? How much time is left?'",
        "If no trade is available, practise holding a common post-plant angle for one isolated pick instead of pushing.",
        "Only commit to the site once you can name your trade or your defuse window.",
      ],
      successCriterion:
        "Across 10 reps, you verbalise trade + time before every entry and default to holding when no trade support exists.",
    },

    memorySummary:
      "As last-alive post-plant, I pushed the site solo and got traded before defusing. Better: hold for a coordinated retake with my rotating teammate so picks can be traded. Cue to remember: 'trade + time before entry.'",
  };
}

export function buildValorantRetakeLabSpec(): LabSpec {
  const packet = valorantRetakeScenario;
  const analysis = valorantRetakeAnalysis();

  return {
    version: "1.0",
    id: `lab-${packet.id}`,
    game: packet.game,
    gameLabel: analysis.gameLabel,
    title: packet.title,
    generationMethod: "verified-prepared",

    sourceInput: analysis.sourceInput,
    playerGoal: analysis.playerGoal,
    situationSummary: analysis.situationSummary,
    mistakeCategory: analysis.mistakeCategory,
    decisionQuestion: analysis.decisionQuestion,

    evidence: packet.evidence,
    facts: packet.facts,
    unknowns: packet.unknowns,
    assumptions: analysis.assumptions,

    components: analysis.components,
    alternatives: analysis.alternatives,
    recommendedAlternativeId: analysis.recommendedAlternativeId,

    drill: analysis.drill,
    memorySummary: analysis.memorySummary,
  };
}
