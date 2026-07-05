import { useMemo, useRef, useState } from "react";
import {
  parseConfig,
  serializeConfig,
  setValue,
  validateConfigFile,
} from "../../lib/config/iniEditor";
import {
  detectAllowedSettings,
  recommendSensitivity,
  revisedFileName,
  computeEdpi,
} from "../../lib/config/valorantConfig";
import { GameShell } from "../lab/GameShell";
import { UnfinishedRegion } from "../lab/UnfinishedRegion";
import { resolveGameProfile } from "../../config/gameExperienceProfiles";

interface RowState {
  key: string;
  label: string;
  original: string;
  proposed: string;
  accepted: boolean;
}

const SAMPLE_CONFIG =
  [
    "; RoundLabs sample Valorant config (illustrative, not a real Riot file)",
    "[Input]",
    "MouseSensitivity=0.35",
    "ScopedSensitivity = 1.0",
    "RawInput=true",
    "MouseAcceleration=false",
    "",
    "[Video]",
    "Fullscreen=1",
    "UnknownVendorKey=leave-me-untouched",
  ].join("\n") + "\n";

export function ConfigWorkspace() {
  const profile = resolveGameProfile("valorant");
  const [fileName, setFileName] = useState<string | null>(null);
  const [originalText, setOriginalText] = useState<string | null>(null);
  const [rows, setRows] = useState<RowState[]>([]);
  const [error, setError] = useState<string | null>(null);

  // sensitivity experiment inputs (no fabrication without these)
  const [dpi, setDpi] = useState<string>("");
  const [targetEdpi, setTargetEdpi] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  function loadText(name: string, text: string, byteLength: number) {
    const v = validateConfigFile(name, text, { byteLength });
    if (!v.ok) {
      setError(v.error ?? "Unsupported file.");
      return;
    }
    setError(null);
    setFileName(name);
    setOriginalText(text);
    const doc = parseConfig(text);
    const detected = detectAllowedSettings(doc);
    setRows(
      detected.map((d) => ({
        key: d.setting.key,
        label: d.setting.label,
        original: d.value,
        proposed: d.value,
        accepted: false,
      })),
    );
  }

  async function onFile(file: File) {
    // Read entirely in the browser as text. Never uploaded, never executed.
    const text = await file.text();
    loadText(file.name, text, file.size);
  }

  const currentSensRow = rows.find((r) => r.key === "MouseSensitivity" || r.key === "Sensitivity");
  const sensRec = useMemo(
    () =>
      recommendSensitivity({
        dpi: dpi ? Number(dpi) : undefined,
        currentSensitivity: currentSensRow ? Number(currentSensRow.original) : undefined,
        targetEdpi: targetEdpi ? Number(targetEdpi) : undefined,
      }),
    [dpi, targetEdpi, currentSensRow],
  );

  // Build revised text by applying only accepted, changed rows to a fresh parse.
  const revisedText = useMemo(() => {
    if (originalText === null) return "";
    let doc = parseConfig(originalText);
    for (const r of rows) {
      if (r.accepted && r.proposed !== r.original) doc = setValue(doc, r.key, r.proposed);
    }
    return serializeConfig(doc);
  }, [originalText, rows]);

  const changedLineDiff = useMemo(() => {
    if (originalText === null) return [];
    const o = originalText.split(/\r?\n/);
    const r = revisedText.split(/\r?\n/);
    const out: { line: number; before: string; after: string }[] = [];
    for (let i = 0; i < Math.max(o.length, r.length); i++) {
      if (o[i] !== r[i]) out.push({ line: i + 1, before: o[i] ?? "", after: r[i] ?? "" });
    }
    return out;
  }, [originalText, revisedText]);

  function setProposed(key: string, value: string) {
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, proposed: value } : r)));
  }
  function toggleAccept(key: string) {
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, accepted: !r.accepted } : r)));
  }

  function applyExperiment() {
    if (sensRec.status !== "experiment" || sensRec.suggestedSensitivity === undefined) return;
    const key = currentSensRow?.key;
    if (!key) return;
    setRows((rs) =>
      rs.map((r) => (r.key === key ? { ...r, proposed: String(sensRec.suggestedSensitivity), accepted: true } : r)),
    );
  }

  function download() {
    if (originalText === null || !fileName) return;
    const blob = new Blob([revisedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = revisedFileName(fileName);
    a.click();
    URL.revokeObjectURL(url);
  }

  function reset() {
    if (originalText === null) return;
    const doc = parseConfig(originalText);
    setRows(detectAllowedSettings(doc).map((d) => ({ key: d.setting.key, label: d.setting.label, original: d.value, proposed: d.value, accepted: false })));
    setDpi("");
    setTargetEdpi("");
  }

  return (
    <GameShell profile={profile}>
      <div className="lab-renderer config-workspace" data-testid="config-workspace">
        <header className="lab-header">
          <div className="lab-header-top">
            <span className="lab-game">Valorant</span>
            <span className="lab-experience-name">Configuration Diagnosis</span>
            <span className="lab-genmethod">in-browser · never overwrites your file</span>
          </div>
          <h1>Current Input Profile</h1>
          <p className="lab-summary">
            Upload a plain-text config. RoundLabs reads it in your browser, suggests
            evidence-aware experiments, shows a diff, and lets you download a revised
            copy. Your original file is never modified and never executed.
          </p>
        </header>

        {originalText === null ? (
          <div
            className="config-drop"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files[0];
              if (f) onFile(f);
            }}
          >
            <p>Drag a <code>.ini</code>, <code>.cfg</code>, or <code>.txt</code> here</p>
            <div className="config-drop-actions">
              <button onClick={() => fileRef.current?.click()}>Choose file</button>
              <button className="ghost" onClick={() => loadText("GameUserSettings.ini", SAMPLE_CONFIG, SAMPLE_CONFIG.length)}>
                Use sample config
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".ini,.cfg,.txt"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f);
              }}
            />
            {error && <p className="config-error" role="alert">{error}</p>}
          </div>
        ) : (
          <div className="config-body">
            <div className="config-file-tag">
              <strong>{fileName}</strong>
              <button className="ghost" onClick={reset}>Reset to original</button>
            </div>
            {error && <p className="config-error" role="alert">{error}</p>}

            {/* Suggested experiment OR an unfinished region demanding DPI/target */}
            {sensRec.status === "experiment" ? (
              <div className="suggested-experiment">
                <h3>Suggested experiment</h3>
                <p>
                  Current eDPI <strong>{sensRec.currentEdpi}</strong> → try sensitivity{" "}
                  <strong>{sensRec.suggestedSensitivity}</strong> for eDPI{" "}
                  <strong>{sensRec.suggestedEdpi}</strong>.
                </p>
                <p className="experiment-note">{sensRec.reason}</p>
                <button onClick={applyExperiment}>Apply as experiment</button>
              </div>
            ) : (
              <UnfinishedRegion
                title="eDPI experiment region"
                missing={sensRec.missing}
                why="These values are required before RoundLabs can calculate or suggest an eDPI experiment. RoundLabs does not invent a sensitivity."
                stillConcluded={
                  sensRec.currentEdpi !== undefined
                    ? `Your current eDPI is ${sensRec.currentEdpi} (from the values provided).`
                    : undefined
                }
                completeAction={
                  <div className="unfinished-inputs">
                    <label>
                      Mouse DPI
                      <input inputMode="numeric" value={dpi} onChange={(e) => setDpi(e.target.value)} placeholder="e.g. 800" />
                    </label>
                    <label>
                      Target eDPI
                      <input inputMode="numeric" value={targetEdpi} onChange={(e) => setTargetEdpi(e.target.value)} placeholder="e.g. 280" />
                    </label>
                    {currentSensRow && (
                      <span className="derived">
                        Current sensitivity from file: <strong>{currentSensRow.original}</strong>
                        {dpi && Number(dpi) > 0 && (
                          <> · eDPI would be <strong>{computeEdpi(Number(dpi), Number(currentSensRow.original))}</strong></>
                        )}
                      </span>
                    )}
                  </div>
                }
              />
            )}

            {/* Recognised, editable settings — unknown keys are never shown/touched */}
            <div className="config-settings">
              <h3>Recognised settings</h3>
              {rows.length === 0 ? (
                <p className="empty-note">No allow-listed settings found in this file. Nothing was changed.</p>
              ) : (
                <table className="config-table">
                  <thead>
                    <tr><th>Setting</th><th>Current</th><th>Proposed</th><th>Apply</th></tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.key} className={r.accepted && r.proposed !== r.original ? "row-accepted" : ""}>
                        <td>{r.label} <code>{r.key}</code></td>
                        <td className="mono">{r.original}</td>
                        <td>
                          <input className="mono" value={r.proposed} onChange={(e) => setProposed(r.key, e.target.value)} />
                        </td>
                        <td>
                          <button className={r.accepted ? "accepted" : "ghost"} onClick={() => toggleAccept(r.key)} aria-pressed={r.accepted}>
                            {r.accepted ? "Accepted" : "Accept"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Diff */}
            <div className="config-diff">
              <h3>Diff ({changedLineDiff.length} changed line{changedLineDiff.length === 1 ? "" : "s"})</h3>
              {changedLineDiff.length === 0 ? (
                <p className="empty-note">No changes accepted yet — the revised file equals the original.</p>
              ) : (
                <ul className="diff-list">
                  {changedLineDiff.map((d) => (
                    <li key={d.line}>
                      <span className="diff-line">L{d.line}</span>
                      <span className="diff-before">- {d.before}</span>
                      <span className="diff-after">+ {d.after}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="config-actions">
              <button onClick={download} disabled={changedLineDiff.length === 0}>
                Download {fileName ? revisedFileName(fileName) : "revised config"}
              </button>
              <span className="config-safe-note">Original never overwritten · file never executed</span>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
}
