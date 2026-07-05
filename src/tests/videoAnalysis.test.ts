import { describe, it, expect } from "vitest";
import {
  validateVideoFile,
  validateVideoAnalysisResult,
  analyzeVideo,
  DEFAULT_MAX_VIDEO_BYTES,
  type VideoAnalysisResult,
} from "../lib/video/videoAnalysis";
// @ts-expect-error Vite raw import — returns the module source as a string.
import videoSrc from "../lib/video/videoAnalysis.ts?raw";

const valid: VideoAnalysisResult = {
  game: "valorant",
  recognitionMethod: "video-analysis",
  confidence: 0.7,
  relevantMoments: [{ timestampStart: 12.4, description: "Push onto site", status: "observed" }],
  observedFacts: [],
  inferredFacts: [
    { id: "if1", label: "Was outnumbered", value: "likely", status: "inferred", sourceIds: [], confidence: 0.6, explanation: "Two enemies visible on the feed." },
  ],
  unknowns: ["Exact time remaining"],
  warnings: [],
  summary: "Solo push onto A site.",
};

describe("video file validation", () => {
  it("2. oversized video produces a controlled error", () => {
    const r = validateVideoFile({ name: "clip.mp4", type: "video/mp4", size: DEFAULT_MAX_VIDEO_BYTES + 1 });
    expect(r.ok).toBe(false);
  });
  it("3. unsupported format produces a controlled error", () => {
    const r = validateVideoFile({ name: "clip.avi", type: "video/x-msvideo", size: 1000 });
    expect(r.ok).toBe(false);
  });
  it("accepts a supported mp4 within limits", () => {
    expect(validateVideoFile({ name: "clip.mp4", type: "video/mp4", size: 1000 }).ok).toBe(true);
  });
});

describe("video analysis response validation", () => {
  it("5. a valid provider response passes runtime validation", () => {
    expect(validateVideoAnalysisResult(valid).ok).toBe(true);
  });
  it("6. invalid provider response does not crash and is rejected", () => {
    expect(() => validateVideoAnalysisResult(null)).not.toThrow();
    expect(validateVideoAnalysisResult({ recognitionMethod: "video-analysis" }).ok).toBe(false);
  });
  it("8. inferred facts require confidence AND explanation", () => {
    const bad = structuredClone(valid);
    delete (bad.inferredFacts[0] as { confidence?: number }).confidence;
    expect(validateVideoAnalysisResult(bad).ok).toBe(false);
  });
});

describe("endpoint adapter + fallback", () => {
  it("4. missing endpoint yields an honest 'unavailable' (no fabricated analysis)", async () => {
    const out = await analyzeVideo(new Blob(["x"]), { fileName: "clip.mp4" }, { url: undefined });
    expect(out.kind).toBe("unavailable");
  });
  it("a configured endpoint returning valid JSON is accepted", async () => {
    const fakeFetch = (async () => ({ ok: true, json: async () => valid })) as unknown as typeof fetch;
    const out = await analyzeVideo(new Blob(["x"]), { fileName: "clip.mp4" }, { url: "https://x/api", fetchImpl: fakeFetch });
    expect(out.kind).toBe("analyzed");
  });
  it("an endpoint returning invalid JSON is reported as invalid, not crashed", async () => {
    const fakeFetch = (async () => ({ ok: true, json: async () => ({ nope: true }) })) as unknown as typeof fetch;
    const out = await analyzeVideo(new Blob(["x"]), { fileName: "clip.mp4" }, { url: "https://x/api", fetchImpl: fakeFetch });
    expect(out.kind).toBe("invalid");
  });
  it("a failing endpoint falls back to 'unavailable'", async () => {
    const fakeFetch = (async () => ({ ok: false, status: 500 })) as unknown as typeof fetch;
    const out = await analyzeVideo(new Blob(["x"]), { fileName: "clip.mp4" }, { url: "https://x/api", fetchImpl: fakeFetch });
    expect(out.kind).toBe("unavailable");
  });
});

describe("10. no provider secret in client source", () => {
  it("the video lib references only VITE_VIDEO_ANALYSIS_ENDPOINT, not any api key", () => {
    const src = videoSrc as string;
    expect(src).toContain("VITE_VIDEO_ANALYSIS_ENDPOINT");
    // No hardcoded secret VALUES (assignments to a string literal, or token shapes).
    // Prose mentioning "secret"/"key" is fine — we scan for actual credentials.
    expect(/(api[_-]?key|secret|token|authorization|bearer)\s*[:=]\s*["'`][^"'`]+["'`]/i.test(src)).toBe(false);
    expect(/sk-[A-Za-z0-9]{16,}/.test(src)).toBe(false);
  });
});
