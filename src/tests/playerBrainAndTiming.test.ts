import { describe, it, expect } from "vitest";
import { LocalPlayerBrain } from "../lib/memory/localPlayerBrain";
import { buildValorantRetakeLabSpec } from "../lib/compiler/buildLabSpec";
import type { LearningRecord } from "../lib/memory/playerBrain";

describe("LocalPlayerBrain (honest local fallback)", () => {
  it("saves and lists a learning record with honest local-only sync state", async () => {
    const brain = new LocalPlayerBrain();
    const record: LearningRecord = {
      id: "rec-1",
      createdAt: new Date().toISOString(),
      game: "valorant",
      scenarioTitle: "A retake",
      mistakeCategory: "Retake timing",
      sourceIds: ["ev-player-report-1"],
      assumptions: [],
      unknowns: [],
      drillTitle: "Retake drill",
      memorySummary: "trade + time before entry",
    };
    const result = await brain.save(record);
    expect(result.syncState).toBe("local-only");
    const list = await brain.list();
    expect(list.some((r) => r.id === "rec-1")).toBe(true);
  });
});

describe("processing time is measurable", () => {
  it("building the lab takes a finite, measurable duration", () => {
    const start = performance.now();
    const spec = buildValorantRetakeLabSpec();
    const elapsed = performance.now() - start;
    expect(spec.title.length).toBeGreaterThan(0);
    expect(Number.isFinite(elapsed)).toBe(true);
    expect(elapsed).toBeGreaterThanOrEqual(0);
  });
});
