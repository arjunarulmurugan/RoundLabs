import type { LabComponentProps } from "./componentProps";
import { StatusBadge } from "./StatusBadge";
import type { FactStatus } from "../../types/verified-scenario";

interface TelemetryRow {
  id: string;
  label: string;
  value: string | number | null;
  unit?: string;
  status: FactStatus;
}

// For sourced F1 values. Any field without a value renders "Unknown" — never a
// plausible fabricated number (master prompt §18 / §12.4).
export function TelemetryPanel({ component }: LabComponentProps) {
  const rows = (component.data.rows as TelemetryRow[] | undefined) ?? [];
  return (
    <div className="lab-card telemetry-panel">
      <h3>{component.title}</h3>
      <table className="telemetry-table">
        <tbody>
          {rows.map((r) => {
            const isKnown =
              r.status !== "unknown" && r.value !== null && r.value !== "";
            return (
              <tr key={r.id}>
                <td>{r.label}</td>
                <td>
                  {isKnown ? `${r.value}${r.unit ? ` ${r.unit}` : ""}` : "Unknown"}
                </td>
                <td>
                  <StatusBadge status={r.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
