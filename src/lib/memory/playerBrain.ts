// RoundLabs — Player Brain contract. Master prompt §20.
// Do not fabricate improvement, confidence, drill completion, or repeated
// patterns — those require real user action / saved history.

export interface LearningRecord {
  id: string;
  createdAt: string;
  game: string;
  scenarioTitle: string;
  mistakeCategory: string;
  sourceIds: string[];
  selectedAlternativeId?: string;
  recommendedAlternativeId?: string;
  betterAlternativeSummary?: string;
  assumptions: string[];
  unknowns: string[];
  drillTitle: string;
  drillCompleted?: boolean;
  playerConfidence?: number;
  memorySummary: string;
}

// Honest sync state — the UI must never claim a GBrain write it did not make.
export type SyncState = "local-only" | "synced-gbrain" | "gbrain-failed";

export interface SaveResult {
  record: LearningRecord;
  syncState: SyncState;
  detail?: string;
}

export interface PlayerBrain {
  save(record: LearningRecord): Promise<SaveResult>;
  list(): Promise<LearningRecord[]>;
}
