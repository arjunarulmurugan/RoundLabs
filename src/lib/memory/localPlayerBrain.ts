// RoundLabs — LocalPlayerBrain. The honest local fallback (master prompt §21).
// Persists LearningRecords to localStorage when available, otherwise to an
// in-memory store (so it works in tests / SSR without crashing).

import type { LearningRecord, PlayerBrain, SaveResult } from "./playerBrain";

const STORAGE_KEY = "roundlabs.playerbrain.v1";

function getStore(): Storage | null {
  try {
    if (typeof localStorage !== "undefined") return localStorage;
  } catch {
    // localStorage can throw in some sandboxed contexts.
  }
  return null;
}

export class LocalPlayerBrain implements PlayerBrain {
  private memory: LearningRecord[] = [];

  private read(): LearningRecord[] {
    const store = getStore();
    if (!store) return this.memory;
    try {
      const raw = store.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as LearningRecord[]) : [];
    } catch {
      return [];
    }
  }

  private write(records: LearningRecord[]): void {
    const store = getStore();
    if (!store) {
      this.memory = records;
      return;
    }
    try {
      store.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch {
      this.memory = records;
    }
  }

  async save(record: LearningRecord): Promise<SaveResult> {
    const records = this.read();
    records.unshift(record);
    this.write(records);
    return { record, syncState: "local-only", detail: "Saved to this device only." };
  }

  async list(): Promise<LearningRecord[]> {
    return this.read();
  }
}
