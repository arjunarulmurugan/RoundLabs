// RoundLabs — VerifiedScenarioPacket contract.
// Source of truth: ROUNDLABS_SOLO_CLAUDE_CODE_MASTER_PROMPT.md §13.
// This is the ONLY place these types are defined. Do not duplicate.

export type SourceType =
  | "player-report"
  | "uploaded-image"
  | "uploaded-video"
  | "replay-log"
  | "telemetry"
  | "battle-log"
  | "public-source";

export type FactStatus =
  | "observed"
  | "user-reported"
  | "source-backed"
  | "inferred"
  | "unknown";

export interface EvidenceReference {
  id: string;
  sourceType: SourceType;
  title: string;
  reporter?: string;
  url?: string;
  fileName?: string;
  timestampOrLocation?: string;
  notes?: string;
}

export interface ScenarioFact {
  id: string;
  label: string;
  value: string | number | boolean | null;
  unit?: string;
  status: FactStatus;
  sourceIds: string[];
  confidence?: number;
  explanation?: string;
}

export interface VerifiedScenarioPacket {
  id: string;
  game: "valorant" | "pokemon" | "f1";
  title: string;
  rawPlayerDescription?: string;
  evidence: EvidenceReference[];
  facts: ScenarioFact[];
  unknowns: string[];
  approvedForDemo: boolean;
  approvedBy?: string;
}
