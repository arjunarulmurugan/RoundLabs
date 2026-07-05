import type { LabComponentProps } from "./componentProps";
import { StatusBadge } from "./StatusBadge";
import type { FactStatus } from "../../types/verified-scenario";

interface Marker {
  id: string;
  label: string;
  area: string;
  status?: FactStatus;
  x?: number; // 0..100 abstract position (not official map coords)
  y?: number;
  kind?: "self" | "ally" | "objective" | "threat" | "path";
  highlightForAltIds?: string[]; // selection-driven spatial emphasis
}

// Spatial decisions on an ABSTRACT tactical surface (no official Riot maps).
// Markers are plotted from the reported account; when an alternative is selected
// the markers tied to it light up, so the spatial emphasis shifts with the choice.
export function MapBoard({ component, selectedAlternativeId }: LabComponentProps) {
  const markers = (component.data.markers as Marker[] | undefined) ?? [];
  const mapLabel = (component.data.mapLabel as string | undefined) ?? "Tactical surface";
  const note = component.data.note as string | undefined;

  const isLit = (m: Marker) =>
    !!selectedAlternativeId && (m.highlightForAltIds ?? []).includes(selectedAlternativeId);

  return (
    <div className="lab-card map-board">
      <h3>{component.title}</h3>
      <div className="map-surface" role="img" aria-label={mapLabel}>
        <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="map-svg" aria-hidden="true">
          {/* abstract site geometry — original, not a game map */}
          <rect x="6" y="8" width="52" height="44" className="map-zone" rx="2" />
          <rect x="62" y="20" width="32" height="30" className="map-zone" rx="2" />
          <line x1="30" y1="52" x2="30" y2="60" className="map-lane" />
          <line x1="78" y1="20" x2="78" y2="8" className="map-lane" />
          {markers.map((m) => {
            const x = m.x ?? 50;
            const y = m.y ?? 30;
            return (
              <g key={m.id} className={`map-marker kind-${m.kind ?? "objective"} ${isLit(m) ? "lit" : ""}`}>
                <circle cx={x} cy={y} r={isLit(m) ? 3.4 : 2.4} />
                <text x={x + 4} y={y + 1.5}>{m.label}</text>
              </g>
            );
          })}
        </svg>
        <span className="map-label">{mapLabel}</span>
      </div>
      <ul className="marker-list">
        {markers.map((m) => (
          <li key={m.id} className={isLit(m) ? "marker-lit" : ""}>
            <span className="marker-area">{m.area}</span>
            <span className="marker-label">{m.label}</span>
            {m.status && <StatusBadge status={m.status} />}
          </li>
        ))}
      </ul>
      {note && <p className="map-note">{note}</p>}
    </div>
  );
}
