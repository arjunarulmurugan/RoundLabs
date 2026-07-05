// RoundLabs — LabSpec contract (one shared contract).
// Source of truth: ROUNDLABS_SOLO_CLAUDE_CODE_MASTER_PROMPT.md §14.
// Reuses EvidenceReference / ScenarioFact from verified-scenario.ts — do not duplicate.

import type { EvidenceReference, ScenarioFact } from "./verified-scenario";

// Rocket League was removed from active product scope (three-game phase).
export type GameId = "valorant" | "pokemon" | "f1" | "other";

export type LabComponentType =
  | "map-board"
  | "decision-tree"
  | "timeline"
  | "risk-reward"
  | "information-card"
  | "alternative-selector"
  | "telemetry-panel"
  | "strategy-comparison"
  | "evidence-panel"
  | "drill-card";

export type GenerationMethod =
  | "verified-prepared"
  | "ai-generated"
  | "deterministic-parser";

export type AlternativeRating =
  | "recommended"
  | "viable"
  | "risky"
  | "critical-error"
  | "insufficient-evidence";

export type RiskLevel = "low" | "moderate" | "high" | "very-high" | "unknown";

export type RewardLevel = "low" | "moderate" | "high" | "unknown";

export interface LabComponentSpec {
  id: string;
  type: LabComponentType;
  title: string;
  order: number;
  width?: "full" | "half" | "third";
  // Optional decision-model override of region placement. When set it wins over
  // the game manifest's primary/secondary lists, so the SAME game with a
  // different decision model (e.g. Valorant retake vs economy) composes
  // differently through the one shared renderer.
  region?: "primary" | "secondary";
  data: Record<string, unknown>;
}

export interface Alternative {
  id: string;
  label: string;
  summary: string;
  risk: RiskLevel;
  reward: RewardLevel;
  rating: AlternativeRating;
  consequence: string;
  reasoning: string;
  supportingFactIds: string[];
  assumptions: string[];
}

export interface DrillSpec {
  id: string;
  title: string;
  objective: string;
  steps: string[];
  successCriterion: string;
}

export interface LabSpec {
  version: "1.0";

  id: string;
  game: GameId;
  gameLabel: string;
  title: string;

  sourceInput?: string;
  generationMethod: GenerationMethod;

  playerGoal: string;
  situationSummary: string;
  mistakeCategory: string;
  decisionQuestion: string;

  evidence: EvidenceReference[];
  facts: ScenarioFact[];
  unknowns: string[];
  assumptions: string[];

  components: LabComponentSpec[];

  alternatives: Alternative[];
  recommendedAlternativeId?: string;

  drill: DrillSpec;
  memorySummary: string;
}

// The set of component types the safe registry accepts. Kept here next to the
// contract so validation and the registry agree on one list.
export const LAB_COMPONENT_TYPES: readonly LabComponentType[] = [
  "map-board",
  "decision-tree",
  "timeline",
  "risk-reward",
  "information-card",
  "alternative-selector",
  "telemetry-panel",
  "strategy-comparison",
  "evidence-panel",
  "drill-card",
] as const;

export const SUPPORTED_GAME_IDS: readonly GameId[] = [
  "valorant",
  "pokemon",
  "f1",
  "other",
] as const;
