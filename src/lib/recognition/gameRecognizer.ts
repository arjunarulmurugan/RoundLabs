// RoundLabs — game recognition layer.
//
// Small, testable, deterministic. Recognition order:
//   1. Explicit user game selection      (method: "explicit-selection")
//   2. Evidence metadata                 (method: "deterministic")
//   3. Uploaded filename, when reliable  (method: "deterministic")
//   4. Deterministic terms from the text (method: "deterministic")
//   5. AI-assisted classification        (typed branch, only if a real
//      classifier is wired — none is in this phase, so it is never invoked)
//   6. User confirmation on ambiguity    (requiresConfirmation: true)
//
// Confidence is CALCULATED from matched distinct keywords — never fabricated —
// and recognition never claims AI when deterministic matching was used.

import type { EvidenceReference } from "../../types/verified-scenario";

export type SupportedGame = "valorant" | "pokemon" | "f1";

export type RecognitionMethod =
  | "explicit-selection"
  | "deterministic"
  | "ai-assisted"
  | "unknown";

export interface GameRecognitionEvidence {
  signal: string;
  matchedValue: string;
  source: "input" | "evidence" | "file-name" | "metadata";
}

export interface GameRecognitionResult {
  game?: SupportedGame;
  confidence: number;
  method: RecognitionMethod;
  evidence: GameRecognitionEvidence[];
  requiresConfirmation: boolean;
}

export const SUPPORTED_GAMES: readonly SupportedGame[] = ["valorant", "pokemon", "f1"] as const;

// Deterministic vocabulary. Retrievable from GBrain ("Game Recognition Rules")
// when available; this checked-in copy is the reliable fallback.
export const GAME_KEYWORDS: Record<SupportedGame, string[]> = {
  valorant: [
    "agent", "spike", "site", "retake", "utility", "defender", "attacker",
    "ultimate", "economy", "buy round", "plant", "defuse", "eco", "ascent",
    "operator", "clutch", "trade",
  ],
  pokemon: [
    "switch", "move", "ability", "item", "type matchup", "fainted", "turn",
    "team preview", "win condition", "sweep", "setup", "priority", "stab",
    "revenge kill", "pivot",
  ],
  f1: [
    "lap", "tyre", "tire", "pit", "stint", "safety car", "undercut", "overcut",
    "ers", "fuel", "sector", "telemetry", "drs", "box", "degradation", "compound",
  ],
};

const CONFIRMATION_THRESHOLD = 0.6;

function countMatches(
  haystack: string,
  source: GameRecognitionEvidence["source"],
): { scores: Record<SupportedGame, number>; evidence: Record<SupportedGame, GameRecognitionEvidence[]> } {
  const text = ` ${haystack.toLowerCase()} `;
  const scores = { valorant: 0, pokemon: 0, f1: 0 } as Record<SupportedGame, number>;
  const evidence = { valorant: [], pokemon: [], f1: [] } as Record<SupportedGame, GameRecognitionEvidence[]>;

  for (const game of SUPPORTED_GAMES) {
    const seen = new Set<string>();
    for (const kw of GAME_KEYWORDS[game]) {
      // Whole-token match on word boundaries so "site" doesn't hit "website".
      const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegExp(kw)}([^a-z0-9]|$)`, "i");
      if (pattern.test(text) && !seen.has(kw)) {
        seen.add(kw);
        scores[game] += 1;
        evidence[game].push({ signal: "keyword", matchedValue: kw, source });
      }
    }
  }
  return { scores, evidence };
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export interface RecognizeInput {
  text?: string;
  explicitGame?: SupportedGame;
  evidence?: EvidenceReference[];
  fileName?: string;
}

export function recognizeGame(input: RecognizeInput): GameRecognitionResult {
  // 1. Explicit selection wins outright.
  if (input.explicitGame) {
    return {
      game: input.explicitGame,
      confidence: 1,
      method: "explicit-selection",
      evidence: [{ signal: "user-selection", matchedValue: input.explicitGame, source: "metadata" }],
      requiresConfirmation: false,
    };
  }

  // 2–4. Accumulate deterministic signals from evidence metadata, filename, and text.
  const combinedScores = { valorant: 0, pokemon: 0, f1: 0 } as Record<SupportedGame, number>;
  const combinedEvidence: GameRecognitionEvidence[] = [];

  const passes: Array<{ haystack: string; source: GameRecognitionEvidence["source"] }> = [];
  if (input.evidence && input.evidence.length > 0) {
    const meta = input.evidence
      .map((e) => [e.title, e.notes, e.timestampOrLocation].filter(Boolean).join(" "))
      .join(" ");
    if (meta.trim()) passes.push({ haystack: meta, source: "evidence" });
  }
  if (input.fileName) passes.push({ haystack: input.fileName, source: "file-name" });
  if (input.text) passes.push({ haystack: input.text, source: "input" });

  for (const pass of passes) {
    const { scores, evidence } = countMatches(pass.haystack, pass.source);
    for (const game of SUPPORTED_GAMES) {
      combinedScores[game] += scores[game];
      combinedEvidence.push(...evidence[game]);
    }
  }

  const ranked = [...SUPPORTED_GAMES].sort((a, b) => combinedScores[b] - combinedScores[a]);
  const top = ranked[0];
  const topScore = combinedScores[top];
  const secondScore = combinedScores[ranked[1]];

  // No deterministic signal at all → do not guess.
  if (topScore === 0) {
    return {
      game: undefined,
      confidence: 0,
      method: "unknown",
      evidence: [],
      requiresConfirmation: true,
    };
  }

  const confidence = topScore / (topScore + secondScore);
  const topEvidence = combinedEvidence.filter(
    (e) => GAME_KEYWORDS[top].includes(e.matchedValue),
  );

  return {
    game: top,
    confidence,
    method: "deterministic",
    evidence: topEvidence,
    requiresConfirmation: confidence < CONFIRMATION_THRESHOLD,
  };
}

// Human-readable explanation for the UI. Deterministic wording only — never
// claims AI when deterministic matching produced the result.
export function explainRecognition(result: GameRecognitionResult): string {
  if (!result.game) return "Game could not be identified confidently.";
  const terms = result.evidence
    .filter((e) => e.signal === "keyword")
    .map((e) => `“${e.matchedValue}”`)
    .slice(0, 4);
  if (result.method === "explicit-selection") return "You selected this game.";
  if (terms.length === 0) return "Matched from provided metadata.";
  return `Matched terms: ${terms.join(", ")}`;
}
