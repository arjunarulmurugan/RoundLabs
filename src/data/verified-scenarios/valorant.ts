import type { VerifiedScenarioPacket } from "../../types/verified-scenario";

// RoundLabs — verified scenario packet (Valorant).
//
// PROVENANCE NOTE (read this before using in a demo):
// This packet is built entirely from a single PLAYER REPORT — a natural-language
// account of a retake decision. It contains NO numeric telemetry. Every fact is
// qualitative and marked "user-reported". Exact positions, timings, economy, and
// HP are deliberately left in `unknowns` rather than invented (master prompt §10).
//
// It is `approvedForDemo: false` until Yuvaraj reviews it and either approves this
// account or swaps in a real, sourced match moment. No fabricated numeric facts.

export const valorantRetakeScenario: VerifiedScenarioPacket = {
  id: "val-retake-a-site-001",
  game: "valorant",
  title: "A-site retake: pushed as last player instead of trading",

  rawPlayerDescription:
    "We were defending A on Ascent. I was the last alive after my teammate died on A-main. " +
    "The spike was already planted. Instead of waiting for my rotating teammate to arrive so we " +
    "could retake together, I pushed into the site alone through Main and got picked before I " +
    "could get a trade or defuse. I felt like I threw the round but I'm not sure what the better " +
    "play actually was.",

  evidence: [
    {
      id: "ev-player-report-1",
      sourceType: "player-report",
      title: "Player's written account of the A retake",
      reporter: "pending-review",
      timestampOrLocation: "Round description (post-plant, A site)",
      notes:
        "Qualitative first-person account. No replay, telemetry, or screenshot attached. " +
        "Numeric details (economy, exact HP, timings, enemy count alive) are unknown.",
    },
  ],

  facts: [
    {
      id: "f-side",
      label: "Team side",
      value: "Defense",
      status: "user-reported",
      sourceIds: ["ev-player-report-1"],
    },
    {
      id: "f-spike",
      label: "Spike state",
      value: "Planted on A",
      status: "user-reported",
      sourceIds: ["ev-player-report-1"],
    },
    {
      id: "f-last-alive",
      label: "Player was last alive",
      value: true,
      status: "user-reported",
      sourceIds: ["ev-player-report-1"],
    },
    {
      id: "f-teammate-rotating",
      label: "A teammate was rotating toward site",
      value: "Reported en route, arrival time unknown",
      status: "user-reported",
      sourceIds: ["ev-player-report-1"],
    },
    {
      id: "f-action-taken",
      label: "Action taken",
      value: "Pushed into site alone via A-main",
      status: "user-reported",
      sourceIds: ["ev-player-report-1"],
    },
    {
      id: "f-outcome",
      label: "Outcome",
      value: "Died before trade or defuse; round lost",
      status: "user-reported",
      sourceIds: ["ev-player-report-1"],
    },
  ],

  unknowns: [
    "Number of enemies still alive on site",
    "Exact time remaining before spike detonation",
    "Player and enemy credits / weapon economy",
    "Player and enemy HP / shields",
    "Exact rotating-teammate arrival time",
    "Available utility (smokes, flashes, recon) for player and enemies",
  ],

  approvedForDemo: false,
  approvedBy: undefined,
};
