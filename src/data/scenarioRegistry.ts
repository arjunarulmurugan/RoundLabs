// RoundLabs — scenario registry. Maps a game (and, within a game, a decision
// model) to a prepared, verified LabSpec builder. This is the checked-in local
// grammar the static build ships with (GitHub Pages runs this, not the GBrain CLI).

import type { LabSpec } from "../types/lab-spec";
import type { SupportedGame } from "../lib/recognition/gameRecognizer";
import { buildValorantRetakeLabSpec } from "../lib/compiler/buildLabSpec";
import { buildValorantEconomyLabSpec, valorantEconomyScenario } from "./verified-scenarios/valorant-economy";
import { buildPokemonSwitchLabSpec, pokemonSwitchScenario } from "./verified-scenarios/pokemon";
import { buildF1PitLabSpec, f1PitScenario } from "./verified-scenarios/f1";
import { valorantRetakeScenario } from "./verified-scenarios/valorant";

export interface ScenarioEntry {
  id: string;
  game: SupportedGame;
  decisionModel: string;
  title: string;
  approvedForDemo: boolean;
  build: () => LabSpec;
  // Deterministic terms that bias same-game scenario selection.
  modelKeywords: string[];
}

export const SCENARIOS: ScenarioEntry[] = [
  {
    id: valorantRetakeScenario.id,
    game: "valorant",
    decisionModel: "retake",
    title: valorantRetakeScenario.title,
    approvedForDemo: valorantRetakeScenario.approvedForDemo,
    build: buildValorantRetakeLabSpec,
    modelKeywords: ["retake", "site", "spike", "defuse", "trade", "utility", "plant", "last alive"],
  },
  {
    id: valorantEconomyScenario.id,
    game: "valorant",
    decisionModel: "economy",
    title: valorantEconomyScenario.title,
    approvedForDemo: valorantEconomyScenario.approvedForDemo,
    build: buildValorantEconomyLabSpec,
    modelKeywords: ["economy", "eco", "buy", "force", "save", "credits", "money", "full-buy"],
  },
  {
    id: pokemonSwitchScenario.id,
    game: "pokemon",
    decisionModel: "switch / win-condition",
    title: pokemonSwitchScenario.title,
    approvedForDemo: pokemonSwitchScenario.approvedForDemo,
    build: buildPokemonSwitchLabSpec,
    modelKeywords: ["switch", "win condition", "setup", "sweeper", "predict"],
  },
  {
    id: f1PitScenario.id,
    game: "f1",
    decisionModel: "pit timing / undercut",
    title: f1PitScenario.title,
    approvedForDemo: f1PitScenario.approvedForDemo,
    build: buildF1PitLabSpec,
    modelKeywords: ["undercut", "overcut", "pit", "box", "stint", "tyre", "tire"],
  },
];

export function scenariosForGame(game: SupportedGame): ScenarioEntry[] {
  return SCENARIOS.filter((s) => s.game === game);
}

export function getScenarioById(id: string): ScenarioEntry | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

// Pick the best scenario for a game given the raw text: score by model keywords,
// falling back to the first (default) scenario for that game.
export function resolveScenario(game: SupportedGame, text: string): ScenarioEntry {
  const candidates = scenariosForGame(game);
  const lc = ` ${text.toLowerCase()} `;
  let best = candidates[0];
  let bestScore = -1;
  for (const c of candidates) {
    const score = c.modelKeywords.reduce((n, kw) => (lc.includes(` ${kw} `) || lc.includes(kw) ? n + 1 : n), 0);
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }
  return best;
}
