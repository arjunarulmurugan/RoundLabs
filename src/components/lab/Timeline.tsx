import type { LabComponentProps } from "./componentProps";
import { StatusBadge } from "./StatusBadge";
import type { FactStatus } from "../../types/verified-scenario";

interface TimelineEvent {
  id: string;
  label: string;
  status?: FactStatus;
  highlightForAltIds?: string[]; // selection-driven temporal emphasis
}

// Event sequence and decision timing. Renders only the events provided; it does
// not synthesise timings. Events tied to the selected alternative are emphasised.
export function Timeline({ component, selectedAlternativeId }: LabComponentProps) {
  const events = (component.data.events as TimelineEvent[] | undefined) ?? [];
  const isLit = (e: TimelineEvent) =>
    !!selectedAlternativeId && (e.highlightForAltIds ?? []).includes(selectedAlternativeId);
  return (
    <div className="lab-card timeline">
      <h3>{component.title}</h3>
      <ol className="timeline-list">
        {events.map((e) => (
          <li key={e.id} className={isLit(e) ? "event-lit" : ""}>
            <span>{e.label}</span>
            {e.status && <StatusBadge status={e.status} />}
          </li>
        ))}
      </ol>
    </div>
  );
}
