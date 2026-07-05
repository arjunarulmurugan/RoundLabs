import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { LabRenderer } from "../components/lab/LabRenderer";
import { GameEmptyState } from "../components/lab/GameEmptyState";
import { TelemetryPanel } from "../components/lab/TelemetryPanel";
import { buildValorantRetakeLabSpec } from "../lib/compiler/buildLabSpec";
import { validateLabSpec } from "../lib/compiler/validateLabSpec";
import {
  resolveGameProfile,
  loadGameProfile,
  GAME_EXPERIENCE_PROFILES,
} from "../config/gameExperienceProfiles";
import type { SupportedGame } from "../lib/recognition/gameRecognizer";
import type { LabComponentSpec } from "../types/lab-spec";

const GAMES: SupportedGame[] = ["valorant", "pokemon", "f1"];

describe("experience profiles", () => {
  it("8. each supported game resolves to a different experience profile (distinct layouts)", () => {
    const layouts = GAMES.map((g) => resolveGameProfile(g).layout);
    expect(new Set(layouts).size).toBe(3);
    expect(layouts).toEqual(["tactical-command", "branch-analysis", "race-strategy"]);
  });

  it("13. GBrain failure uses the local experience profile", async () => {
    const loaded = await loadGameProfile("valorant");
    expect(loaded.source).toBe("local-fallback");
    expect(loaded.profile).toBe(GAME_EXPERIENCE_PROFILES.valorant);
  });
});

describe("shared LabRenderer renders each experience", () => {
  it("9./10. same LabRenderer renders the verified Valorant lab in its tactical layout", () => {
    const spec = buildValorantRetakeLabSpec();
    expect(validateLabSpec(spec).ok).toBe(true); // existing Valorant LabSpec still validates
    const markup = renderToStaticMarkup(
      createElement(LabRenderer, { spec, processingTimeSeconds: 0.1 }),
    );
    expect(markup).toContain('data-layout="tactical-command"');
    expect(markup).toContain("Tactical Review");
    expect(markup).toContain('data-testid="lab-renderer"');
  });

  it("12. missing Pokémon scenario data produces a controlled game-specific empty state", () => {
    const markup = renderToStaticMarkup(
      createElement(GameEmptyState, {
        profile: resolveGameProfile("pokemon"),
        profileSource: "local-fallback" as const,
      }),
    );
    expect(markup).toContain('data-layout="branch-analysis"');
    expect(markup).toContain("Awaiting a verified Pokémon turn");
    expect(markup).toContain("Awaiting verified scenario data");
  });

  it("12b. missing F1 scenario data produces a controlled race-strategy empty state", () => {
    const markup = renderToStaticMarkup(
      createElement(GameEmptyState, {
        profile: resolveGameProfile("f1"),
        profileSource: "local-fallback" as const,
      }),
    );
    expect(markup).toContain('data-layout="race-strategy"');
    expect(markup).toContain("Awaiting verified race telemetry");
  });

  it("the three environments render as substantially different layouts", () => {
    const valorant = renderToStaticMarkup(
      createElement(LabRenderer, { spec: buildValorantRetakeLabSpec() }),
    );
    const pokemon = renderToStaticMarkup(
      createElement(GameEmptyState, {
        profile: resolveGameProfile("pokemon"),
        profileSource: "local-fallback" as const,
      }),
    );
    const f1 = renderToStaticMarkup(
      createElement(GameEmptyState, {
        profile: resolveGameProfile("f1"),
        profileSource: "local-fallback" as const,
      }),
    );
    expect(valorant).toContain("tactical-command");
    expect(pokemon).toContain("branch-analysis");
    expect(f1).toContain("race-strategy");
  });
});

describe("F1 telemetry does not invent absent values", () => {
  it("11. unknown F1 telemetry fields remain Unknown", () => {
    const component: LabComponentSpec = {
      id: "c-tel",
      type: "telemetry-panel",
      title: "Telemetry",
      order: 1,
      data: {
        rows: [
          { id: "r1", label: "Lap time", value: null, status: "unknown" },
          { id: "r2", label: "Tyre compound", value: "medium", status: "user-reported" },
        ],
      },
    };
    const spec = buildValorantRetakeLabSpec(); // spec only supplies shared props
    const markup = renderToStaticMarkup(
      createElement(TelemetryPanel, {
        spec,
        component,
        selectedAlternativeId: null,
        onSelectAlternative: () => {},
      }),
    );
    expect(markup).toContain("Unknown");
    expect(markup).toContain("medium");
    // the unknown row must not have invented a lap time number
    expect(markup).not.toMatch(/Lap time<\/td><td>[0-9]/);
  });
});
