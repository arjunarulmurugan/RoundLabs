// RoundLabs — Game Experience Manifests.
//
// One minimal declarative contract consumed by the SINGLE shared LabRenderer to
// produce a substantially different decision environment per game (layout,
// density, component prominence, labels, theme tokens, empty state) — WITHOUT
// duplicating game pages.
//
// These checked-in profiles are the reliable fallback. When GBrain is available
// the same profiles can be retrieved from it (see loadGameProfile); if GBrain is
// locked/unavailable the app uses these local profiles and never blocks.

import type { LabComponentType } from "../types/lab-spec";
import type { SupportedGame } from "../lib/recognition/gameRecognizer";

export type ExperienceLayout = "tactical-command" | "branch-analysis" | "race-strategy";
export type ExperienceDensity = "focused" | "balanced" | "dense";

export interface GameExperienceProfile {
  game: SupportedGame;
  label: string;
  experienceName: string;
  decisionModel: string; // short preview line for the home selector

  layout: ExperienceLayout;
  density: ExperienceDensity;

  primaryComponentTypes: LabComponentType[];
  secondaryComponentTypes: LabComponentType[];

  // Theme tokens are plain CSS values, applied by GameShell as CSS custom
  // properties. Distinct per game — palette AND typographic treatment.
  themeTokens: {
    surfaceStyle: string; // --game-surface
    borderStyle: string; // --game-border
    accentStyle: string; // --game-accent
    headingStyle: string; // --game-heading-font
    dataStyle: string; // --game-data-font
  };

  labels: {
    decision: string;
    evidence: string;
    alternatives: string;
    drill: string;
    unknowns: string;
  };

  emptyState: {
    title: string;
    description: string;
  };
}

const MONO = '"SFMono-Regular", ui-monospace, "JetBrains Mono", Menlo, monospace';
const SANS = 'Inter, system-ui, -apple-system, sans-serif';

export const VALORANT_PROFILE: GameExperienceProfile = {
  game: "valorant",
  label: "Valorant",
  experienceName: "Tactical Review",
  decisionModel: "Spatial and tactical decisions",
  layout: "tactical-command",
  density: "dense",
  primaryComponentTypes: ["map-board", "timeline", "alternative-selector"],
  secondaryComponentTypes: ["information-card", "risk-reward", "evidence-panel", "drill-card"],
  themeTokens: {
    surfaceStyle: "#12171d",
    borderStyle: "#2b3a44",
    accentStyle: "#ff5470",
    headingStyle: MONO,
    dataStyle: MONO,
  },
  labels: {
    decision: "Tactical Decision",
    evidence: "Evidence Feed",
    alternatives: "Tactical Options",
    drill: "Training Protocol",
    unknowns: "Unconfirmed Intel",
  },
  emptyState: {
    title: "No verified round loaded",
    description: "Load a verified Valorant round to open the tactical review.",
  },
};

export const POKEMON_PROFILE: GameExperienceProfile = {
  game: "pokemon",
  label: "Competitive Pokémon",
  experienceName: "Turn Analysis",
  decisionModel: "Branching and hidden-information decisions",
  layout: "branch-analysis",
  density: "balanced",
  primaryComponentTypes: ["decision-tree", "alternative-selector"],
  secondaryComponentTypes: ["information-card", "risk-reward", "evidence-panel", "drill-card"],
  themeTokens: {
    surfaceStyle: "#161a24",
    borderStyle: "#333a52",
    accentStyle: "#7c9cff",
    headingStyle: SANS,
    dataStyle: SANS,
  },
  labels: {
    decision: "Turn Decision",
    evidence: "Revealed Information",
    alternatives: "Decision Branches",
    drill: "Practice Sequence",
    unknowns: "Hidden Information",
  },
  emptyState: {
    title: "Awaiting a verified Pokémon turn",
    description:
      "No verified competitive-Pokémon scenario has been approved yet. RoundLabs will not invent a battle, hidden moves, items, or damage rolls. Add a sourced turn and it will open as a branch-analysis board.",
  },
};

export const F1_PROFILE: GameExperienceProfile = {
  game: "f1",
  label: "F1 racing game",
  experienceName: "Strategy Review",
  decisionModel: "Telemetry and strategy decisions",
  layout: "race-strategy",
  density: "dense",
  primaryComponentTypes: ["timeline", "telemetry-panel", "strategy-comparison"],
  secondaryComponentTypes: ["information-card", "risk-reward", "alternative-selector", "evidence-panel", "drill-card"],
  themeTokens: {
    surfaceStyle: "#14161a",
    borderStyle: "#3a3f47",
    accentStyle: "#ffb020",
    headingStyle: SANS,
    dataStyle: MONO,
  },
  labels: {
    decision: "Decision Window",
    evidence: "Data Sources",
    alternatives: "Strategy Options",
    drill: "Engineer Drill",
    unknowns: "Unknown Telemetry",
  },
  emptyState: {
    title: "Awaiting verified race telemetry",
    description:
      "No verified F1 scenario has been approved yet. RoundLabs will not fabricate lap times, tyre wear, pit loss, gaps, ERS, or fuel. Add sourced telemetry and it will open as a race-strategy workstation — unknown fields stay marked Unknown.",
  },
};

export const GAME_EXPERIENCE_PROFILES: Record<SupportedGame, GameExperienceProfile> = {
  valorant: VALORANT_PROFILE,
  pokemon: POKEMON_PROFILE,
  f1: F1_PROFILE,
};

// Synchronous local resolver — always available, never throws.
export function resolveGameProfile(game: SupportedGame): GameExperienceProfile {
  return GAME_EXPERIENCE_PROFILES[game];
}

export type ProfileSource = "gbrain" | "local-fallback";

export interface LoadedProfile {
  profile: GameExperienceProfile;
  source: ProfileSource;
}

// GBrain-preferred loader with honest local fallback. GBrain retrieval is not
// wired in this phase (the brain is locked by a running `gbrain serve`); this
// always returns the local profile and reports the source truthfully so the UI
// never claims a GBrain read it did not make.
export async function loadGameProfile(game: SupportedGame): Promise<LoadedProfile> {
  return { profile: resolveGameProfile(game), source: "local-fallback" };
}
