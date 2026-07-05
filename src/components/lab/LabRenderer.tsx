import { useMemo, useState } from "react";
import type { LabSpec, LabComponentSpec, GameId } from "../../types/lab-spec";
import type { LearningRecord, SaveResult } from "../../lib/memory/playerBrain";
import { validateLabSpec } from "../../lib/compiler/validateLabSpec";
import { resolveComponent } from "../../registry/componentRegistry";
import { ComponentErrorBoundary } from "./ComponentErrorBoundary";
import { LabSpecViewer } from "./LabSpecViewer";
import { GameShell } from "./GameShell";
import {
  resolveGameProfile,
  type GameExperienceProfile,
  type ProfileSource,
} from "../../config/gameExperienceProfiles";
import type { SupportedGame } from "../../lib/recognition/gameRecognizer";

// The single shared renderer (master prompt §17). No game-specific page
// hardcoding. Composition is driven by the validated LabSpec AND the game's
// experience manifest: primary components get prominence, section framing uses
// game-specific labels, and GameShell applies the game's layout/theme.
interface Props {
  spec: LabSpec;
  processingTimeSeconds?: number;
  demoReady?: boolean;
  profileSource?: ProfileSource;
  onSaveLesson?: (record: LearningRecord) => Promise<SaveResult>;
}

const SUPPORTED = new Set<GameId>(["valorant", "pokemon", "f1"]);

export function LabRenderer({
  spec,
  processingTimeSeconds,
  demoReady,
  profileSource = "local-fallback",
  onSaveLesson,
}: Props) {
  const validation = useMemo(
    () => validateLabSpec(spec, { demoReady: demoReady ?? true }),
    [spec, demoReady],
  );

  // Resolve the experience manifest for this game (local fallback is always
  // available; "other" falls back to Valorant grammar so nothing crashes).
  const profile: GameExperienceProfile = useMemo(
    () => resolveGameProfile((SUPPORTED.has(spec.game) ? spec.game : "valorant") as SupportedGame),
    [spec.game],
  );

  const [selectedAlternativeId, setSelectedAlternativeId] = useState<string | null>(
    spec.recommendedAlternativeId ?? spec.alternatives[0]?.id ?? null,
  );
  const [showSpec, setShowSpec] = useState(false);
  const [saveState, setSaveState] = useState<SaveResult | null>(null);

  // Controlled error — never crash (master prompt §15). Still themed by game.
  if (!validation.ok) {
    return (
      <GameShell profile={profile}>
        <div className="lab-error" role="alert">
          <h2>This lab did not pass validation</h2>
          <p>RoundLabs will not render an unverified lab. Issues found:</p>
          <ul>
            {validation.errors.map((e, i) => (
              <li key={i}>
                <code>{e.code}</code> — {e.message}
              </li>
            ))}
          </ul>
        </div>
      </GameShell>
    );
  }

  const sortedComponents = [...spec.components].sort((a, b) => a.order - b.order);
  const primarySet = new Set(profile.primaryComponentTypes);
  // A component's own `region` (set by the decision model) overrides the game
  // manifest, so retake vs economy compose differently on the same surface.
  const isPrimary = (c: LabComponentSpec) =>
    c.region ? c.region === "primary" : primarySet.has(c.type);
  const primaryComponents = sortedComponents.filter(isPrimary);
  const secondaryComponents = sortedComponents.filter((c) => !isPrimary(c));

  // Selecting an alternative re-emphasises the surface (spatial focus, path,
  // timeline, evidence, drill) via data-emphasis, which the stylesheet keys off.
  const selectedAlt = spec.alternatives.find((a) => a.id === selectedAlternativeId);

  async function handleSave() {
    if (!onSaveLesson) return;
    const record: LearningRecord = {
      id: `rec-${spec.id}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      game: spec.game,
      scenarioTitle: spec.title,
      mistakeCategory: spec.mistakeCategory,
      sourceIds: spec.evidence.map((e) => e.id),
      selectedAlternativeId: selectedAlternativeId ?? undefined,
      recommendedAlternativeId: spec.recommendedAlternativeId,
      betterAlternativeSummary: spec.alternatives.find(
        (a) => a.id === spec.recommendedAlternativeId,
      )?.summary,
      assumptions: spec.assumptions,
      unknowns: spec.unknowns,
      drillTitle: spec.drill.title,
      memorySummary: spec.memorySummary,
    };
    const result = await onSaveLesson(record);
    setSaveState(result);
  }

  const renderComponent = (component: LabComponentSpec) => {
    const Comp = resolveComponent(component.type);
    if (!Comp) {
      // Unreachable — validation rejects unknown components.
      return (
        <div key={component.id} className="lab-card component-error">
          Unknown component: {component.type}
        </div>
      );
    }
    return (
      <div
        key={component.id}
        className={`lab-slot width-${component.width ?? "full"}`}
        data-component-type={component.type}
      >
        <ComponentErrorBoundary componentId={component.id}>
          <Comp
            spec={spec}
            component={component}
            selectedAlternativeId={selectedAlternativeId}
            onSelectAlternative={setSelectedAlternativeId}
          />
        </ComponentErrorBoundary>
      </div>
    );
  };

  return (
    <GameShell profile={profile}>
      <div
        className="lab-renderer"
        data-testid="lab-renderer"
        data-emphasis={selectedAlt?.rating ?? "none"}
        data-decision-model={(spec.components.some((c) => c.region) ? "custom" : "default")}
      >
        <header className="lab-header">
          <div className="lab-header-top">
            <span className="lab-game">{spec.gameLabel}</span>
            <span className="lab-experience-name">{profile.experienceName}</span>
            <span className="lab-genmethod">{spec.generationMethod}</span>
            <span className="lab-profile-source">
              profile: {profileSource === "gbrain" ? "GBrain" : "local"}
            </span>
            {processingTimeSeconds !== undefined && (
              <span className="lab-timing" data-testid="processing-time">
                Processing time: {processingTimeSeconds.toFixed(1)} seconds
              </span>
            )}
          </div>
          <p className="lab-decision-label">{profile.labels.decision}</p>
          <h1>{spec.title}</h1>
          <p className="lab-mistake">
            <strong>Mistake category:</strong> {spec.mistakeCategory}
          </p>
          <p className="lab-question">{spec.decisionQuestion}</p>
          <p className="lab-summary">{spec.situationSummary}</p>
          {validation.warnings.length > 0 && (
            <ul className="lab-warnings">
              {validation.warnings.map((w, i) => (
                <li key={i}>Note: {w.message}</li>
              ))}
            </ul>
          )}
        </header>

        <div className="lab-regions">
          <section className="lab-primary" aria-label={`${profile.experienceName} — primary`}>
            {primaryComponents.map(renderComponent)}
          </section>
          <aside className="lab-secondary" aria-label={`${profile.experienceName} — supporting`}>
            {secondaryComponents.map(renderComponent)}
          </aside>
        </div>

        <footer className="lab-footer">
          <button onClick={() => setShowSpec((s) => !s)}>
            {showSpec ? "Hide LabSpec" : "View LabSpec"}
          </button>
          {onSaveLesson && <button onClick={handleSave}>Save Lesson</button>}
          {saveState && (
            <span className="save-state" data-testid="save-state">
              {saveState.syncState === "local-only" && "Saved locally on this device."}
              {saveState.syncState === "synced-gbrain" && "Saved to Player Brain (GBrain)."}
              {saveState.syncState === "gbrain-failed" &&
                "GBrain write failed — saved locally instead."}
            </span>
          )}
        </footer>

        {showSpec && <LabSpecViewer spec={spec} />}
      </div>
    </GameShell>
  );
}
