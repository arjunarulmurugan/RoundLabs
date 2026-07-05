import type { LabSpec } from "../../types/lab-spec";

// "View LabSpec" — shows the raw validated spec so nothing is hidden from the
// player or the judge (master prompt §17.13).
export function LabSpecViewer({ spec }: { spec: LabSpec }) {
  return (
    <div className="labspec-viewer">
      <pre>{JSON.stringify(spec, null, 2)}</pre>
    </div>
  );
}
