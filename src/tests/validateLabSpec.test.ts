import { describe, it, expect } from "vitest";
import { buildValorantRetakeLabSpec } from "../lib/compiler/buildLabSpec";
import { validateLabSpec } from "../lib/compiler/validateLabSpec";
import type { LabSpec } from "../types/lab-spec";

function base(): LabSpec {
  return structuredClone(buildValorantRetakeLabSpec());
}

describe("validateLabSpec — evidence-backed slice", () => {
  it("1. valid evidence-backed LabSpec passes", () => {
    const r = validateLabSpec(base(), { demoReady: true });
    expect(r.ok).toBe(true);
    expect(r.errors).toEqual([]);
  });

  it("2. missing evidence fails for a demo-ready lab", () => {
    const spec = base();
    spec.evidence = [];
    const r = validateLabSpec(spec, { demoReady: true });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.code === "evidence.missing")).toBe(true);
  });

  it("3. broken source reference fails", () => {
    const spec = base();
    spec.facts[0].sourceIds = ["does-not-exist"];
    const r = validateLabSpec(spec, { demoReady: true });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.code === "fact.source.broken")).toBe(true);
  });

  it("4. inferred fact without confidence fails", () => {
    const spec = base();
    spec.facts.push({
      id: "f-inf",
      label: "Inferred thing",
      value: "x",
      status: "inferred",
      sourceIds: ["ev-player-report-1"],
      explanation: "because",
    });
    const r = validateLabSpec(spec, { demoReady: true });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.code === "fact.inferred.confidence")).toBe(true);
  });

  it("5. inferred fact without explanation fails", () => {
    const spec = base();
    spec.facts.push({
      id: "f-inf2",
      label: "Inferred thing",
      value: "x",
      status: "inferred",
      sourceIds: ["ev-player-report-1"],
      confidence: 0.6,
    });
    const r = validateLabSpec(spec, { demoReady: true });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.code === "fact.inferred.explanation")).toBe(true);
  });

  it("6. unknown value disguised as a fact fails", () => {
    const spec = base();
    spec.facts.push({
      id: "f-unk",
      label: "Enemies alive",
      value: 2, // pretending a real number while marked unknown
      status: "unknown",
      sourceIds: [],
    });
    const r = validateLabSpec(spec, { demoReady: true });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.code === "fact.unknown.disguised")).toBe(true);
  });

  it("7. unsupported component fails", () => {
    const spec = base();
    // deliberately inject an unregistered component type
    (spec.components[0] as { type: string }).type = "holo-deck";
    const r = validateLabSpec(spec, { demoReady: true });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.code === "component.unsupported")).toBe(true);
  });

  it("8. one-alternative lab fails", () => {
    const spec = base();
    spec.alternatives = [spec.alternatives[0]];
    spec.recommendedAlternativeId = spec.alternatives[0].id;
    const r = validateLabSpec(spec, { demoReady: true });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.code === "alternatives.tooFew")).toBe(true);
  });

  it("9. invalid recommendation id fails", () => {
    const spec = base();
    spec.recommendedAlternativeId = "not-a-real-alt";
    const r = validateLabSpec(spec, { demoReady: true });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.code === "recommendation.invalid")).toBe(true);
  });

  it("10. missing drill fails", () => {
    const spec = base();
    (spec as { drill: unknown }).drill = { id: "", title: "", objective: "", steps: [], successCriterion: "" };
    const r = validateLabSpec(spec, { demoReady: true });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.code === "drill.missing")).toBe(true);
  });

  it("duplicate component ids fail", () => {
    const spec = base();
    spec.components[1].id = spec.components[0].id;
    const r = validateLabSpec(spec, { demoReady: true });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.code === "component.id.duplicate")).toBe(true);
  });

  it("does not throw on a structurally broken spec (controlled error)", () => {
    const broken = { version: "9.9", game: "chess" } as unknown as LabSpec;
    expect(() =>
      validateLabSpec(
        { ...base(), ...broken, facts: [], components: [], alternatives: [], evidence: [] },
        { demoReady: true },
      ),
    ).not.toThrow();
  });
});
