import type { ReactNode } from "react";

// A structurally UNFINISHED region of the clay — not a polished panel with an
// "Unknown" badge. It reads as intentionally unformed (dashed/incomplete
// boundary) and states what is missing, why it matters, what can still be
// concluded, and what action completes it. Accessible via shape + text, not
// colour or animation alone.
export interface UnfinishedRegionProps {
  title: string;
  missing: string[];
  why: string;
  stillConcluded?: string;
  completeAction?: ReactNode; // e.g. an input/prompt to supply the missing value
}

export function UnfinishedRegion({
  title,
  missing,
  why,
  stillConcluded,
  completeAction,
}: UnfinishedRegionProps) {
  return (
    <section className="unfinished-region" role="group" aria-label={`Unfinished region: ${title}`}>
      <div className="unfinished-edge" aria-hidden="true" />
      <div className="unfinished-body">
        <p className="unfinished-tag">Unfinished region</p>
        <h4>{title}</h4>
        <div className="unfinished-missing">
          <span className="unfinished-label">Missing</span>
          <ul>
            {missing.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
        <p className="unfinished-why">
          <span className="unfinished-label">Why it matters</span> {why}
        </p>
        {stillConcluded && (
          <p className="unfinished-still">
            <span className="unfinished-label">Still concluded</span> {stillConcluded}
          </p>
        )}
        {completeAction && <div className="unfinished-action">{completeAction}</div>}
      </div>
    </section>
  );
}
