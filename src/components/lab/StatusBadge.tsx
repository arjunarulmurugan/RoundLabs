import type { FactStatus } from "../../types/verified-scenario";

// Small provenance badge so facts, inferences, and unknowns are visually distinct.
const LABELS: Record<FactStatus, string> = {
  observed: "Observed",
  "user-reported": "Reported",
  "source-backed": "Sourced",
  inferred: "Inferred",
  unknown: "Unknown",
};

export function StatusBadge({ status }: { status: FactStatus }) {
  return <span className={`badge badge-${status}`}>{LABELS[status]}</span>;
}
