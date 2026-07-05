import type { LabComponentProps } from "./componentProps";
import { StatusBadge } from "./StatusBadge";

// Facts, resources, and unknowns. Unknowns are shown explicitly as "Unknown"
// rather than filled with plausible values (master prompt §18 / §10).
export function InformationCard({ spec, component }: LabComponentProps) {
  const showUnknowns = component.data.showUnknowns !== false;
  return (
    <div className="lab-card">
      <h3>{component.title}</h3>
      <ul className="fact-list">
        {spec.facts.map((f) => (
          <li key={f.id} className="fact-row">
            <span className="fact-label">{f.label}</span>
            <span className="fact-value">
              {f.status === "unknown" || f.value === null || f.value === ""
                ? "Unknown"
                : String(f.value)}
              {f.unit ? ` ${f.unit}` : ""}
            </span>
            <StatusBadge status={f.status} />
          </li>
        ))}
      </ul>
      {showUnknowns && spec.unknowns.length > 0 && (
        <div className="unknowns-block">
          <h4>Unknown at this moment</h4>
          <ul>
            {spec.unknowns.map((u, i) => (
              <li key={i}>
                {u} <span className="badge badge-unknown">Unknown</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
