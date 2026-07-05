// RoundLabs — honest video-analysis pipeline.
//
// The frontend NEVER holds a provider secret. It only knows a serverless endpoint
// URL (via VITE_VIDEO_ANALYSIS_ENDPOINT). When that endpoint is absent or fails,
// the app falls back to an honest manual path and MUST NOT claim "AI analyzed".

import type { ScenarioFact } from "../../types/verified-scenario";

export type VideoGame = "valorant" | "pokemon" | "f1";

export interface VideoMoment {
  timestampStart: number;
  timestampEnd?: number;
  description: string;
  status: "observed" | "inferred" | "unknown";
  confidence?: number;
}

export interface VideoAnalysisResult {
  game?: VideoGame;
  recognitionMethod: "video-analysis";
  confidence?: number;
  relevantMoments: VideoMoment[];
  observedFacts: ScenarioFact[];
  inferredFacts: ScenarioFact[];
  unknowns: string[];
  warnings: string[];
  decisionCategory?: string;
  summary: string;
}

// ---- file validation (pure) ----
export const SUPPORTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
export const DEFAULT_MAX_VIDEO_BYTES = 60 * 1024 * 1024; // 60 MB
export const DEFAULT_MAX_VIDEO_SECONDS = 90;

export interface FileValidation {
  ok: boolean;
  error?: string;
}

export function validateVideoFile(
  file: { name: string; type: string; size: number },
  opts: { maxBytes?: number } = {},
): FileValidation {
  const maxBytes = opts.maxBytes ?? DEFAULT_MAX_VIDEO_BYTES;
  if (!SUPPORTED_VIDEO_TYPES.includes(file.type)) {
    return { ok: false, error: `Unsupported video format "${file.type || "unknown"}". Use MP4, WebM, or MOV.` };
  }
  if (file.size > maxBytes) {
    return { ok: false, error: `Video is too large (${Math.round(file.size / 1024 / 1024)} MB). Limit is ${Math.round(maxBytes / 1024 / 1024)} MB.` };
  }
  return { ok: true };
}

// ---- runtime validation of a provider/endpoint response ----
export interface VideoValidation {
  ok: boolean;
  errors: string[];
  value?: VideoAnalysisResult;
}

const GAMES = new Set(["valorant", "pokemon", "f1"]);

export function validateVideoAnalysisResult(input: unknown): VideoValidation {
  const errors: string[] = [];
  const x = input as Partial<VideoAnalysisResult> | null;
  if (!x || typeof x !== "object") return { ok: false, errors: ["Response is not an object."] };

  if (x.recognitionMethod !== "video-analysis") errors.push('recognitionMethod must be "video-analysis".');
  if (x.game !== undefined && !GAMES.has(x.game)) errors.push(`Unsupported game "${x.game}".`);
  if (typeof x.summary !== "string" || x.summary.trim() === "") errors.push("summary must be a non-empty string.");
  if (!Array.isArray(x.relevantMoments)) errors.push("relevantMoments must be an array.");
  else {
    x.relevantMoments.forEach((m, i) => {
      if (typeof m.timestampStart !== "number") errors.push(`moment[${i}] missing numeric timestampStart.`);
      if (!m.description) errors.push(`moment[${i}] missing description.`);
      if (!["observed", "inferred", "unknown"].includes(m.status)) errors.push(`moment[${i}] invalid status.`);
    });
  }
  // Inferences must carry confidence + explanation (provenance rule).
  const inferred = Array.isArray(x.inferredFacts) ? x.inferredFacts : [];
  inferred.forEach((f, i) => {
    if (f.status !== "inferred") errors.push(`inferredFacts[${i}] must have status "inferred".`);
    if (typeof f.confidence !== "number") errors.push(`inferredFacts[${i}] missing numeric confidence.`);
    if (!f.explanation || f.explanation.trim() === "") errors.push(`inferredFacts[${i}] missing explanation.`);
  });
  if (!Array.isArray(x.observedFacts)) errors.push("observedFacts must be an array.");
  if (!Array.isArray(x.unknowns)) errors.push("unknowns must be an array.");
  if (!Array.isArray(x.warnings)) errors.push("warnings must be an array.");

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, errors: [], value: x as VideoAnalysisResult };
}

// ---- endpoint adapter ----
export type AnalyzeOutcome =
  | { kind: "analyzed"; result: VideoAnalysisResult }
  | { kind: "unavailable"; reason: string }
  | { kind: "invalid"; errors: string[] };

function endpointUrl(): string | undefined {
  try {
    // Vite exposes only VITE_-prefixed, non-secret vars to the client.
    const env = (import.meta as unknown as { env?: Record<string, string> }).env;
    const url = env?.VITE_VIDEO_ANALYSIS_ENDPOINT;
    return url && url.trim() ? url.trim() : undefined;
  } catch {
    return undefined;
  }
}

export function isVideoEndpointConfigured(): boolean {
  return endpointUrl() !== undefined;
}

// Sends the video to the configured serverless endpoint. The endpoint (not the
// client) holds the provider key. Returns a controlled outcome; never throws.
export async function analyzeVideo(
  file: Blob,
  meta: { fileName: string; timestampStart?: number; timestampEnd?: number },
  deps: { fetchImpl?: typeof fetch; url?: string } = {},
): Promise<AnalyzeOutcome> {
  const url = deps.url ?? endpointUrl();
  if (!url) return { kind: "unavailable", reason: "No video-analysis endpoint configured (VITE_VIDEO_ANALYSIS_ENDPOINT unset)." };
  const doFetch = deps.fetchImpl ?? (typeof fetch !== "undefined" ? fetch : undefined);
  if (!doFetch) return { kind: "unavailable", reason: "No fetch implementation available." };

  try {
    const form = new FormData();
    form.append("video", file, meta.fileName);
    if (meta.timestampStart !== undefined) form.append("timestampStart", String(meta.timestampStart));
    if (meta.timestampEnd !== undefined) form.append("timestampEnd", String(meta.timestampEnd));
    const res = await doFetch(url, { method: "POST", body: form });
    if (!res.ok) return { kind: "unavailable", reason: `Endpoint returned HTTP ${res.status}.` };
    const json = await res.json();
    const v = validateVideoAnalysisResult(json);
    if (!v.ok) return { kind: "invalid", errors: v.errors };
    return { kind: "analyzed", result: v.value! };
  } catch (e) {
    return { kind: "unavailable", reason: `Endpoint call failed: ${(e as Error).message}` };
  }
}
