import { describe, it, expect } from "vitest";
import { SCENARIOS, resolveScenario, scenariosForGame } from "../data/scenarioRegistry";
import { validateLabSpec } from "../lib/compiler/validateLabSpec";

describe("scenario registry — all prepared labs are valid", () => {
  it("every registered scenario builds a LabSpec that passes validation", () => {
    for (const s of SCENARIOS) {
      const spec = s.build();
      const r = validateLabSpec(spec, { demoReady: true });
      expect(r.ok, `${s.id}: ${r.errors.map((e) => e.code).join(",")}`).toBe(true);
    }
  });

  it("covers all three games", () => {
    const games = new Set(SCENARIOS.map((s) => s.game));
    expect(games).toEqual(new Set(["valorant", "pokemon", "f1"]));
  });

  it("every prepared lab offers >=2 alternatives, a drill, and a valid recommendation", () => {
    for (const s of SCENARIOS) {
      const spec = s.build();
      expect(spec.alternatives.length).toBeGreaterThanOrEqual(2);
      expect(spec.drill.title.length).toBeGreaterThan(0);
      expect(spec.alternatives.some((a) => a.id === spec.recommendedAlternativeId)).toBe(true);
    }
  });
});

describe("same-game proof (Phase 7): two decision models → different composition", () => {
  it("resolves Valorant retake vs economy from the description", () => {
    const retake = resolveScenario("valorant", "last alive, spike planted, I pushed the retake alone");
    const economy = resolveScenario("valorant", "lost pistol, it was a save but I force-bought a rifle, we went broke");
    expect(retake.decisionModel).toBe("retake");
    expect(economy.decisionModel).toBe("economy");
    expect(retake.id).not.toBe(economy.id);
  });

  it("the two Valorant labs compose differently: retake is map-dominant, economy has no map", () => {
    const retake = resolveScenario("valorant", "retake spike site").build();
    const economy = resolveScenario("valorant", "eco save force buy credits").build();

    const retakeHasMap = retake.components.some((c) => c.type === "map-board");
    const economyHasMap = economy.components.some((c) => c.type === "map-board");
    expect(retakeHasMap).toBe(true);
    expect(economyHasMap).toBe(false); // map must not dominate the economy decision

    // economy makes the decision-tree a primary region via the component override
    const economyTree = economy.components.find((c) => c.type === "decision-tree");
    expect(economyTree?.region).toBe("primary");
  });
});

describe("F1 telemetry stays honest", () => {
  it("the F1 lab keeps telemetry unknowns as unknown and invents no numbers in facts", () => {
    const f1 = scenariosForGame("f1")[0].build();
    // No fact carries a fabricated numeric value.
    for (const fact of f1.facts) {
      expect(typeof fact.value).not.toBe("number");
    }
    const tel = f1.components.find((c) => c.type === "telemetry-panel");
    const rows = (tel?.data.rows as Array<{ status: string; value: unknown }>) ?? [];
    const unknownRows = rows.filter((r) => r.status === "unknown");
    expect(unknownRows.length).toBeGreaterThan(0);
    expect(unknownRows.every((r) => r.value === null)).toBe(true);
  });
});
