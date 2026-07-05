import type { LabSpec } from "../../types/lab-spec";
import type { VerifiedScenarioPacket } from "../../types/verified-scenario";

// RoundLabs — F1 scenario (player report). PROVENANCE: a single qualitative
// player account of a pit-timing decision. NO numeric telemetry is invented —
// lap times, tyre age/wear, pit loss, gaps, ERS and fuel are all left Unknown
// (master prompt §12.4). approvedForDemo:false pending review.

export const f1PitScenario: VerifiedScenarioPacket = {
  id: "f1-undercut-001",
  game: "f1",
  title: "Reacted to the undercut instead of holding track position",
  rawPlayerDescription:
    "Racing online, I was running second. The car behind pitted for fresh tyres. I panicked and " +
    "boxed the very next lap to cover the undercut, but I came out in traffic and lost more time " +
    "than if I'd stayed out. I don't have the exact gaps or lap times — it just felt like the wrong call.",
  evidence: [
    {
      id: "ev-f1-report",
      sourceType: "player-report",
      title: "Player's account of the pit-timing decision",
      reporter: "pending-review",
      timestampOrLocation: "Mid-race, running P2",
      notes: "Qualitative only. No telemetry export, replay, or timing screen attached.",
    },
  ],
  facts: [
    { id: "ff-pos", label: "Track position", value: "Running P2", status: "user-reported", sourceIds: ["ev-f1-report"] },
    { id: "ff-rival", label: "Rival action", value: "Car behind pitted for fresh tyres", status: "user-reported", sourceIds: ["ev-f1-report"] },
    { id: "ff-action", label: "Action taken", value: "Boxed next lap to cover the undercut", status: "user-reported", sourceIds: ["ev-f1-report"] },
    { id: "ff-outcome", label: "Outcome", value: "Rejoined in traffic; lost net time", status: "user-reported", sourceIds: ["ev-f1-report"] },
  ],
  unknowns: [
    "Gap to the car behind (seconds)",
    "Tyre age and estimated degradation",
    "Pit-loss time for this circuit",
    "Traffic on the out-lap",
    "Lap-time delta on old vs fresh tyres",
    "Fuel and ERS state",
  ],
  approvedForDemo: false,
};

export function buildF1PitLabSpec(): LabSpec {
  return {
    version: "1.0",
    id: `lab-${f1PitScenario.id}`,
    game: "f1",
    gameLabel: "F1 racing game",
    title: f1PitScenario.title,
    generationMethod: "verified-prepared",
    sourceInput: f1PitScenario.rawPlayerDescription,
    playerGoal: "Finish ahead of the car behind while managing tyres and track position.",
    situationSummary:
      "Running P2, the car behind pitted for fresh tyres. The player boxed immediately to cover the undercut and rejoined in traffic, losing net time.",
    mistakeCategory: "Pit-stop timing / reacting to the undercut",
    decisionQuestion:
      "When the car behind pits for the undercut, should you react immediately, hold track position, or wait and overcut?",
    evidence: f1PitScenario.evidence,
    facts: f1PitScenario.facts,
    unknowns: f1PitScenario.unknowns,
    assumptions: [
      "The out-lap traffic was avoidable by staying out one or two more laps. (Traffic state is unknown.)",
      "Tyre life remained to run a longer stint. (Tyre age/degradation is unknown.)",
    ],
    components: [
      { id: "cf-timeline", type: "timeline", title: "Stint & decision window", order: 1, region: "primary", data: {
        events: [
          { id: "e1", label: "Running P2, steady pace", status: "user-reported" },
          { id: "e2", label: "Car behind boxes for fresh tyres", status: "user-reported", highlightForAltIds: ["f1-alt-react", "f1-alt-overcut"] },
          { id: "e3", label: "You box the very next lap", status: "user-reported", highlightForAltIds: ["f1-alt-react"] },
          { id: "e4", label: "Rejoin in traffic, lose net time", status: "user-reported", highlightForAltIds: ["f1-alt-react"] },
        ],
      } },
      { id: "cf-tel", type: "telemetry-panel", title: "Telemetry (mostly unknown)", order: 2, region: "primary", data: {
        rows: [
          { id: "r-gap", label: "Gap to car behind", value: null, status: "unknown" },
          { id: "r-tyre", label: "Tyre age", value: null, status: "unknown" },
          { id: "r-pit", label: "Pit-loss time", value: null, status: "unknown" },
          { id: "r-traffic", label: "Out-lap traffic", value: "present", status: "user-reported" },
          { id: "r-ers", label: "ERS state", value: null, status: "unknown" },
          { id: "r-fuel", label: "Fuel", value: null, status: "unknown" },
        ],
      } },
      { id: "cf-strat", type: "strategy-comparison", title: "Strategy paths", order: 3, region: "primary", data: {
        strategies: [
          { id: "s1", label: "React immediately", summary: "Box next lap to cover the undercut.", tradeoff: "Guarantees no undercut, but risks a bad out-lap in traffic — what happened." },
          { id: "s2", label: "Hold position", summary: "Stay out, defend on track.", tradeoff: "Keeps clean air, but exposed to fresher tyres later." },
          { id: "s3", label: "Overcut", summary: "Extend the stint, pit later into clear air.", tradeoff: "Can leapfrog if pace holds, but degradation risk is unknown." },
        ],
      } },
      { id: "cf-info", type: "information-card", title: "Race state", order: 4, data: { showUnknowns: true } },
      { id: "cf-risk", type: "risk-reward", title: "Risk vs reward", order: 5, data: {} },
      { id: "cf-alts", type: "alternative-selector", title: "Strategy options", order: 6, data: {} },
      { id: "cf-ev", type: "evidence-panel", title: "Data sources", order: 7, data: {} },
      { id: "cf-drill", type: "drill-card", title: "Engineer drill", order: 8, data: {} },
    ],
    alternatives: [
      { id: "f1-alt-react", label: "React immediately (the call made)", summary: "Box the next lap to cover the undercut.", risk: "high", reward: "low", rating: "risky",
        consequence: "You rejoin in traffic and lose more net time than the undercut would have cost — the reported outcome.",
        reasoning: "Covering an undercut only pays when your out-lap is clean and the gap is small; reacting blindly without knowing the gap or traffic often costs more than it saves.",
        supportingFactIds: ["ff-action", "ff-outcome"], assumptions: [] },
      { id: "f1-alt-hold", label: "Hold track position", summary: "Stay out and defend on track.", risk: "moderate", reward: "moderate", rating: "viable",
        consequence: "You keep clean air and control the race, but must defend later against fresher tyres.",
        reasoning: "Track position plus clean air is valuable when pit loss and traffic are uncertain; defending a known position can beat a speculative stop.",
        supportingFactIds: ["ff-pos", "ff-rival"], assumptions: ["Tyre life remains to defend."] },
      { id: "f1-alt-overcut", label: "Overcut into clear air", summary: "Extend the stint, pit later into a gap.", risk: "moderate", reward: "high", rating: "recommended",
        consequence: "If pace holds, you pit into clear air and rejoin ahead — the highest-value line when your tyres are still alive.",
        reasoning: "An overcut converts track position into a later, cleaner stop; without a known undercut delta, protecting clean air is the stronger expected-value play.",
        supportingFactIds: ["ff-pos", "ff-rival"], assumptions: ["Degradation allows a longer stint (unknown)."] },
    ],
    recommendedAlternativeId: "f1-alt-overcut",
    drill: {
      id: "f1-drill", title: "Undercut-response drill",
      objective: "Train yourself to check gap, traffic, and tyre life before reacting to a rival's stop.",
      steps: [
        "In a practice race, have the car behind pit while you run P2.",
        "Before boxing, say aloud: 'What's the gap, is my out-lap clean, do my tyres still have life?'",
        "Only cover the undercut if the gap is small AND the out-lap is clear; otherwise hold or overcut.",
        "Review whether reacting actually gained or lost net time.",
      ],
      successCriterion: "Across 5 rival stops, you verbalise gap + traffic + tyre life before deciding, and stop reacting reflexively.",
    },
    memorySummary:
      "Reacted to an undercut by boxing immediately and rejoined in traffic, losing net time. Better: protect clean air and overcut, or hold position — react only with a known small gap and clean out-lap. Cue: 'gap, traffic, tyre life before you box.'",
  };
}
