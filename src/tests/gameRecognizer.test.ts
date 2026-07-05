import { describe, it, expect } from "vitest";
import {
  recognizeGame,
  explainRecognition,
  SUPPORTED_GAMES,
} from "../lib/recognition/gameRecognizer";

describe("gameRecognizer", () => {
  it("1. explicit Valorant selection resolves to Valorant", () => {
    const r = recognizeGame({ text: "anything at all", explicitGame: "valorant" });
    expect(r.game).toBe("valorant");
    expect(r.method).toBe("explicit-selection");
    expect(r.requiresConfirmation).toBe(false);
  });

  it("2. Valorant terms resolve deterministically", () => {
    const r = recognizeGame({ text: "I lost the retake, wrong utility on A site, no trade" });
    expect(r.game).toBe("valorant");
    expect(r.method).toBe("deterministic");
    expect(r.requiresConfirmation).toBe(false);
  });

  it("3. Pokémon terms resolve deterministically", () => {
    const r = recognizeGame({
      text: "Bad switch into their setup sweeper after team preview cost me the win condition",
    });
    expect(r.game).toBe("pokemon");
    expect(r.method).toBe("deterministic");
  });

  it("4. F1 terms resolve deterministically", () => {
    const r = recognizeGame({
      text: "Pitted too early, the undercut failed and my tyre degradation over the stint was bad",
    });
    expect(r.game).toBe("f1");
    expect(r.method).toBe("deterministic");
  });

  it("5. ambiguous input requires confirmation", () => {
    // one Valorant signal ("site") vs one Pokémon signal ("switch") → tie
    const r = recognizeGame({ text: "I had to switch to the site" });
    expect(r.requiresConfirmation).toBe(true);
    expect(r.confidence).toBeLessThan(0.6);
  });

  it("6. empty input does not guess a game", () => {
    const r = recognizeGame({ text: "" });
    expect(r.game).toBeUndefined();
    expect(r.method).toBe("unknown");
    expect(r.requiresConfirmation).toBe(true);
  });

  it("7. Rocket League is no longer a supported result", () => {
    expect(SUPPORTED_GAMES).not.toContain("rocket-league" as unknown);
    const r = recognizeGame({ text: "aerial kickoff demo boost stealing possession" });
    expect(r.game).not.toBe("rocket-league");
    // no supported keywords present → no confident guess
    expect(r.game).toBeUndefined();
  });

  it("14. recognition explanation does not claim AI when deterministic", () => {
    const r = recognizeGame({ text: "retake with utility on A site" });
    expect(r.method).not.toBe("ai-assisted");
    const explanation = explainRecognition(r).toLowerCase();
    expect(explanation).not.toContain("ai");
    expect(explanation).toContain("matched");
  });

  it("confidence is calculated, not fabricated (single-game clean signal → 1.0)", () => {
    const r = recognizeGame({ text: "pit stint tyre undercut ers fuel" });
    expect(r.game).toBe("f1");
    expect(r.confidence).toBe(1);
  });
});
