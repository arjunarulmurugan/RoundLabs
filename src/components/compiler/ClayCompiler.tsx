import { useMemo, useRef, useState } from "react";
import { recognizeGame, explainRecognition, type SupportedGame } from "../../lib/recognition/gameRecognizer";
import { resolveScenario, type ScenarioEntry } from "../../data/scenarioRegistry";
import { RecognitionBanner } from "../lab/RecognitionBanner";
import { MaterialInput } from "../input/MaterialInput";
import { navigate } from "../../lib/router/hashRouter";
import type { LabSpec } from "../../types/lab-spec";
import type { LearningRecord } from "../../lib/memory/playerBrain";

type Phase = "neutral" | "transforming";

const STAGE_MS = 520; // ~3.5s total across 6 stages — within the 3–5s demo target

interface CompileStage {
  key: string;
  label: string;
  detail: string;
}

const EXAMPLES: { text: string; hint: string }[] = [
  { text: "Last alive on defense, spike planted on A, I pushed the retake alone instead of waiting for my rotating teammate.", hint: "Valorant · retake" },
  { text: "I was ahead but stayed in and attacked predicting a switch, instead of switching to keep my sweeper as the win condition.", hint: "Pokémon · win condition" },
  { text: "Running P2, the car behind pitted for fresh tyres so I boxed the next lap to cover the undercut and came out in traffic.", hint: "F1 · pit timing" },
];

function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

// Builds the transformation narration from REAL resolved data — not decoration.
function buildStages(entry: ScenarioEntry, spec: LabSpec, matchedTerms: string): CompileStage[] {
  const unknownCount = spec.unknowns.length;
  const factCount = spec.facts.length;
  const tools = [...new Set(spec.components.map((c) => c.type))].slice(0, 5).join(", ");
  return [
    { key: "read", label: "Reading the match moment", detail: "Preserving your words verbatim" },
    { key: "game", label: `Recognising the game — ${spec.gameLabel}`, detail: matchedTerms },
    { key: "structure", label: "Recognising the decision structure", detail: `${entry.decisionModel} · ${spec.mistakeCategory}` },
    { key: "facts", label: "Separating facts from unknowns", detail: `${factCount} reported facts · ${unknownCount} unknowns kept visible` },
    { key: "tools", label: "Selecting reasoning tools", detail: tools },
    { key: "reshape", label: "Reshaping the surface", detail: `${spec.alternatives.length} alternatives · 1 drill` },
  ];
}

interface Props {
  lessons: LearningRecord[];
}

export function ClayCompiler({ lessons }: Props) {
  const [phase, setPhase] = useState<Phase>("neutral");
  const [text, setText] = useState("");
  const [reporter, setReporter] = useState("");
  const [explicitGame, setExplicitGame] = useState<SupportedGame | "">("");
  const [stages, setStages] = useState<CompileStage[]>([]);
  const [stageIndex, setStageIndex] = useState(0);
  const [resolved, setResolved] = useState<{ spec: LabSpec; entry: ScenarioEntry; ms: number } | null>(null);
  const timers = useRef<number[]>([]);

  const recognition = useMemo(
    () => recognizeGame({ text, explicitGame: explicitGame || undefined }),
    [text, explicitGame],
  );

  const canCompile = !!recognition.game && !recognition.requiresConfirmation;

  function clearTimers() {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  }

  // Navigation to the lab route happens AFTER the transform plays here, so the
  // reshape begins before the route change (continuity, not a page load).
  function goToLab(entry: ScenarioEntry) {
    navigate(`/lab/${encodeURIComponent(entry.id)}`);
  }

  function compile() {
    if (!recognition.game || recognition.requiresConfirmation) return;
    const game = recognition.game;
    const entry = resolveScenario(game, text);

    // Measure real build time from submit to built + validated spec.
    const start = performance.now();
    const spec = entry.build();
    const ms = performance.now() - start;

    const built = { spec, entry, ms };
    const seq = buildStages(entry, spec, explainRecognition(recognition));
    setResolved(built);
    setStages(seq);
    setStageIndex(0);
    setPhase("transforming");
    clearTimers();

    if (prefersReducedMotion()) {
      // Accessible path: no animation — show all steps then route immediately.
      setStageIndex(seq.length);
      const t = window.setTimeout(() => goToLab(entry), 80);
      timers.current.push(t);
      return;
    }

    seq.forEach((_, i) => {
      const t = window.setTimeout(() => setStageIndex(i + 1), STAGE_MS * (i + 1));
      timers.current.push(t);
    });
    const done = window.setTimeout(() => goToLab(entry), STAGE_MS * seq.length + 400);
    timers.current.push(done);
  }

  function skip() {
    if (!resolved) return;
    clearTimers();
    goToLab(resolved.entry);
  }

  if (phase === "transforming" && resolved) {
    return (
      <div className="clay-surface phase-transforming" data-phase="transforming" aria-live="polite">
        <div className="transform-top">
          <p className="transform-eyebrow">Compiling the decision lab…</p>
          <button className="ghost small transform-skip" onClick={skip}>Skip →</button>
        </div>
        <ol className="transform-stages">
          {stages.map((s, i) => (
            <li key={s.key} className={i < stageIndex ? "stage-done" : i === stageIndex ? "stage-active" : "stage-pending"}>
              <span className="stage-mark" aria-hidden="true" />
              <span className="stage-body">
                <strong>{s.label}</strong>
                <span className="stage-detail">{s.detail}</span>
              </span>
            </li>
          ))}
        </ol>
        <div className="clay-morph" aria-hidden="true">
          <span /><span /><span /><span />
        </div>
      </div>
    );
  }

  // NEUTRAL state — the compiler is the centre of the product.
  return (
    <div className="clay-surface phase-neutral" data-phase="neutral">
      <div className="clay-input-block">
        <label className="clay-primary-label" htmlFor="clay-text">
          Describe the match moment.
        </label>
        <p className="clay-sub">
          One neutral surface. It reads your moment, recognises the game and the
          decision, then reshapes into the right reasoning instrument.
        </p>
        <textarea
          id="clay-text"
          className="clay-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Last alive on A, spike planted, I pushed the retake alone instead of waiting for my teammate…"
        />

        <div className="clay-controls">
          <div className="clay-field">
            <label className="field-label" htmlFor="clay-game">Game (optional)</label>
            <select id="clay-game" value={explicitGame} onChange={(e) => setExplicitGame(e.target.value as SupportedGame | "")}>
              <option value="">Let it recognise</option>
              <option value="valorant">Valorant</option>
              <option value="pokemon">Competitive Pokémon</option>
              <option value="f1">F1 racing game</option>
            </select>
          </div>
          <div className="clay-field">
            <label className="field-label" htmlFor="clay-reporter">Source / reporter (optional)</label>
            <input id="clay-reporter" value={reporter} onChange={(e) => setReporter(e.target.value)} placeholder="e.g. my own clip" />
          </div>
          <button className="clay-compile" onClick={compile} disabled={!canCompile}
            title={canCompile ? "Reshape the surface into a decision lab" : "Describe a moment or pick a game first"}>
            Compile decision lab
          </button>
        </div>

        {(text.trim() !== "" || explicitGame) && <RecognitionBanner result={recognition} />}

        <MaterialInput />

        <div className="clay-examples">
          <span className="clay-examples-label">Try a moment:</span>
          {EXAMPLES.map((ex) => (
            <button key={ex.hint} className="clay-example" onClick={() => setText(ex.text)}>
              {ex.hint}
            </button>
          ))}
        </div>

        <p className="honest-note">
          Prepared, verified scenarios (player-reported, 0 fabricated numbers, unknowns
          shown). Live AI generation is a later phase. GitHub Pages runs checked-in
          grammar, not the GBrain CLI.
        </p>
      </div>

      <aside className="clay-recent" aria-label="recent lessons">
        <h3>Recent lessons</h3>
        {lessons.length === 0 ? (
          <p className="empty-note">No lessons saved yet — compile a moment and save the lesson.</p>
        ) : (
          <ul>
            {lessons.slice(0, 4).map((l) => (
              <li key={l.id}>
                <strong>{l.scenarioTitle}</strong>
                <span className="lesson-summary">{l.mistakeCategory}</span>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
