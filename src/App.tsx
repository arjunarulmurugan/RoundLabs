import { useEffect, useMemo, useState } from "react";
import { ClayCompiler } from "./components/compiler/ClayCompiler";
import { LabRenderer } from "./components/lab/LabRenderer";
import { ConfigWorkspace } from "./components/valorant/ConfigWorkspace";
import { LocalPlayerBrain } from "./lib/memory/localPlayerBrain";
import { getScenarioById } from "./data/scenarioRegistry";
import { useRoute, navigate } from "./lib/router/hashRouter";
import type { LearningRecord } from "./lib/memory/playerBrain";

const brain = new LocalPlayerBrain();

function Wordmark() {
  return (
    <header className="app-wordmark">
      <a className="wordmark" href="#/">RoundLabs</a>
      <span className="wordmark-tag">Decision training for competitive games.</span>
      <nav className="app-nav">
        <a href="#/">Compile</a>
        <a href="#/lessons">Lessons</a>
        <a href="#/valorant/config">Valorant config</a>
      </nav>
    </header>
  );
}

function ArchFooter() {
  return (
    <footer className="app-arch" aria-label="architecture">
      <span>Digital Clay · one surface reshapes per decision</span>
      <span className="arch-dot">•</span>
      <span>3 games</span>
      <span className="arch-dot">•</span>
      <span>1 LabSpec · 1 renderer · 1 registry</span>
      <span className="arch-dot">•</span>
      <span>0 fabricated numeric facts</span>
    </footer>
  );
}

export default function App() {
  const route = useRoute();
  const [lessons, setLessons] = useState<LearningRecord[]>([]);

  useEffect(() => {
    brain.list().then(setLessons);
  }, []);

  async function handleSave(record: LearningRecord) {
    const result = await brain.save(record);
    setLessons(await brain.list());
    return result;
  }

  // Build the lab lazily for a /lab/:id route, measuring real compile time.
  const labData = useMemo(() => {
    if (route.name !== "lab") return null;
    const entry = getScenarioById(route.id);
    if (!entry) return null;
    const start = performance.now();
    const spec = entry.build();
    return { spec, ms: performance.now() - start, entry };
  }, [route]);

  return (
    <main className="app">
      <Wordmark />

      {route.name === "home" && <ClayCompiler lessons={lessons} />}

      {route.name === "valorant-config" && (
        <>
          <button className="back-button" onClick={() => navigate("/")}>← Back to RoundLabs</button>
          <ConfigWorkspace />
        </>
      )}

      {route.name === "lab" && labData && (
        <>
          <button className="back-button" onClick={() => navigate("/")}>← Reshape another moment</button>
          <LabRenderer
            spec={labData.spec}
            processingTimeSeconds={labData.ms / 1000}
            demoReady={labData.entry.approvedForDemo}
            profileSource="local-fallback"
            onSaveLesson={handleSave}
          />
        </>
      )}

      {route.name === "lab" && !labData && (
        <section className="route-error">
          <h2>Unknown lab</h2>
          <p>No lab exists for that id. It may have been mistyped.</p>
          <button onClick={() => navigate("/")}>← Back to RoundLabs</button>
        </section>
      )}

      {route.name === "lessons" && (
        <section className="lessons-route" aria-label="saved lessons">
          <h2>Saved lessons</h2>
          {lessons.length === 0 ? (
            <p className="empty-note">No lessons saved yet. Compile a moment and press Save Lesson.</p>
          ) : (
            <ul className="lessons-list">
              {lessons.map((l) => (
                <li key={l.id}>
                  <strong>{l.scenarioTitle}</strong>
                  <span className="lesson-summary">{l.game} · {l.mistakeCategory}</span>
                  <span className="lesson-summary">{l.memorySummary}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {route.name === "not-found" && (
        <section className="route-error">
          <h2>Page not found</h2>
          <p>Nothing lives at <code>{route.path}</code>.</p>
          <button onClick={() => navigate("/")}>← Back to RoundLabs</button>
        </section>
      )}

      <ArchFooter />
    </main>
  );
}
