import { useRef, useState } from "react";
import { navigate } from "../../lib/router/hashRouter";
import {
  validateVideoFile,
  analyzeVideo,
  isVideoEndpointConfigured,
  type VideoAnalysisResult,
} from "../../lib/video/videoAnalysis";
import { validateConfigFile } from "../../lib/config/iniEditor";

// One analysis space that accepts different MATERIALS (image / video / config),
// not four unrelated form cards. No network upload happens until the user acts.
type MaterialKind = "image" | "video" | "config";

interface Material {
  kind: MaterialKind;
  file: File;
  previewUrl?: string;
}

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export function MaterialInput() {
  const [material, setMaterial] = useState<Material | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoState, setVideoState] = useState<
    | { phase: "idle" }
    | { phase: "analyzing" }
    | { phase: "analyzed"; result: VideoAnalysisResult }
    | { phase: "fallback"; reason: string }
  >({ phase: "idle" });
  const [manualTs, setManualTs] = useState("");
  const [manualDesc, setManualDesc] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function clear() {
    if (material?.previewUrl) URL.revokeObjectURL(material.previewUrl);
    setMaterial(null);
    setError(null);
    setVideoState({ phase: "idle" });
  }

  async function accept(file: File, kind: MaterialKind) {
    setError(null);
    if (kind === "image") {
      if (!file.type.startsWith("image/")) return setError("That is not an image file.");
      if (file.size > MAX_IMAGE_BYTES) return setError("Image is too large (limit 8 MB).");
      setMaterial({ kind, file, previewUrl: URL.createObjectURL(file) });
    } else if (kind === "video") {
      const v = validateVideoFile(file);
      if (!v.ok) return setError(v.error ?? "Unsupported video.");
      setMaterial({ kind, file, previewUrl: URL.createObjectURL(file) });
      setVideoState({ phase: "idle" });
    } else {
      const text = await file.text();
      const v = validateConfigFile(file.name, text, { byteLength: file.size });
      if (!v.ok) return setError(v.error ?? "Unsupported config file.");
      setMaterial({ kind, file });
    }
  }

  async function runVideoAnalysis() {
    if (!material || material.kind !== "video") return;
    setVideoState({ phase: "analyzing" });
    const out = await analyzeVideo(material.file, { fileName: material.file.name });
    if (out.kind === "analyzed") setVideoState({ phase: "analyzed", result: out.result });
    else if (out.kind === "invalid") setVideoState({ phase: "fallback", reason: `Endpoint response was invalid: ${out.errors[0]}` });
    else setVideoState({ phase: "fallback", reason: out.reason });
  }

  return (
    <div className="material-input">
      <div className="material-add" role="group" aria-label="add match material">
        <span className="material-add-label">Add material</span>
        <button className="ghost" onClick={() => { inputRef.current!.accept = "image/*"; (inputRef.current as HTMLInputElement).dataset.kind = "image"; inputRef.current?.click(); }}>Image</button>
        <button className="ghost" onClick={() => { inputRef.current!.accept = "video/mp4,video/webm,video/quicktime"; (inputRef.current as HTMLInputElement).dataset.kind = "video"; inputRef.current?.click(); }}>Video</button>
        <button className="ghost" onClick={() => { inputRef.current!.accept = ".ini,.cfg,.txt"; (inputRef.current as HTMLInputElement).dataset.kind = "config"; inputRef.current?.click(); }}>Config file</button>
        <input
          ref={inputRef}
          type="file"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            const kind = (e.target as HTMLInputElement).dataset.kind as MaterialKind;
            if (f && kind) accept(f, kind);
            e.target.value = "";
          }}
        />
      </div>

      {error && <p className="config-error" role="alert">{error}</p>}

      {material && (
        <div className={`material-chip kind-${material.kind}`}>
          <div className="material-meta">
            <strong>{material.file.name}</strong>
            <span>{(material.file.size / 1024).toFixed(0)} KB · {material.kind}</span>
            <button className="ghost small" onClick={clear}>Remove</button>
          </div>

          {material.kind === "image" && material.previewUrl && (
            <img className="material-preview" src={material.previewUrl} alt={`Preview of ${material.file.name}`} />
          )}

          {material.kind === "video" && material.previewUrl && (
            <div className="material-video">
              {/* Local preview only — nothing is uploaded until you press Analyze. */}
              <video className="material-preview" src={material.previewUrl} controls preload="metadata" />
              {videoState.phase === "idle" && (
                <div className="video-actions">
                  <button onClick={runVideoAnalysis}>
                    {isVideoEndpointConfigured() ? "Analyze video" : "Analyze video (endpoint not set → manual)"}
                  </button>
                </div>
              )}
              {videoState.phase === "analyzing" && <p>Analyzing via secure endpoint…</p>}
              {videoState.phase === "analyzed" && (
                <div className="video-result">
                  <p className="video-tag ai">Video-analysis result{videoState.result.game ? ` · ${videoState.result.game}` : ""}</p>
                  <p>{videoState.result.summary}</p>
                  <ul>{videoState.result.relevantMoments.map((m, i) => (
                    <li key={i}>{m.timestampStart.toFixed(1)}s — {m.description} <em>({m.status})</em></li>
                  ))}</ul>
                </div>
              )}
              {videoState.phase === "fallback" && (
                <div className="video-fallback">
                  <p className="video-tag manual">Manual (no AI claim) — {videoState.reason}</p>
                  <p>Add the important timestamp and what happened. This is recorded as <strong>user-reported</strong>, not AI-analyzed.</p>
                  <div className="fallback-inputs">
                    <label>Timestamp (s)<input inputMode="numeric" value={manualTs} onChange={(e) => setManualTs(e.target.value)} placeholder="e.g. 42" /></label>
                    <label>What happened<input value={manualDesc} onChange={(e) => setManualDesc(e.target.value)} placeholder="e.g. pushed the retake alone" /></label>
                  </div>
                </div>
              )}
            </div>
          )}

          {material.kind === "config" && (
            <div className="material-config">
              <p>Plain-text config attached. Open the Valorant configuration workspace to inspect, edit, diff, and download a revised copy.</p>
              <button onClick={() => navigate("/valorant/config")}>Open configuration workspace</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
