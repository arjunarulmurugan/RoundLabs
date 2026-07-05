import type { LabComponentProps } from "./componentProps";
import { StatusBadge } from "./StatusBadge";

// Required for every complete lab (master prompt §18). Shows the sources, how
// many facts are backed, and the visible unknowns/assumptions.
export function EvidencePanel({ spec, component }: LabComponentProps) {
  const backed = spec.facts.filter((f) => f.sourceIds.length > 0).length;
  return (
    <div className="lab-card evidence-panel">
      <h3>{component.title}</h3>

      <div className="evidence-meta">
        <span>
          {backed}/{spec.facts.length} facts linked to a source
        </span>
        <span>Generation: {spec.generationMethod}</span>
      </div>

      <h4>Sources</h4>
      <ul className="evidence-list">
        {spec.evidence.map((e) => (
          <li key={e.id}>
            <strong>{e.title}</strong>
            <span className="evidence-type">{e.sourceType}</span>
            {e.reporter && <span className="evidence-reporter">reporter: {e.reporter}</span>}
            {e.timestampOrLocation && <span>{e.timestampOrLocation}</span>}
            {e.url && (
              <a href={e.url} target="_blank" rel="noreferrer">
                link
              </a>
            )}
            {e.notes && <p className="evidence-notes">{e.notes}</p>}
          </li>
        ))}
      </ul>

      <h4>Fact provenance</h4>
      <ul className="evidence-facts">
        {spec.facts.map((f) => (
          <li key={f.id}>
            <span className="fact-label">{f.label}</span>
            <StatusBadge status={f.status} />
            <span className="evidence-srcids">
              {f.sourceIds.length > 0 ? f.sourceIds.join(", ") : "no source"}
            </span>
            {f.status === "inferred" && typeof f.confidence === "number" && (
              <span className="confidence">confidence {Math.round(f.confidence * 100)}%</span>
            )}
          </li>
        ))}
      </ul>

      {spec.assumptions.length > 0 && (
        <>
          <h4>Assumptions (projected analysis, not observed)</h4>
          <ul className="assumptions-list">
            {spec.assumptions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
