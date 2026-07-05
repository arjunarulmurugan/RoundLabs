import type { LabComponentProps } from "./componentProps";

// Objective, steps, and success criterion (master prompt §18).
export function DrillCard({ spec, component }: LabComponentProps) {
  const drill = spec.drill;
  return (
    <div className="lab-card drill-card">
      <h3>{component.title}</h3>
      <h4>{drill.title}</h4>
      <p className="drill-objective">
        <strong>Objective:</strong> {drill.objective}
      </p>
      <ol className="drill-steps">
        {drill.steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
      <p className="drill-success">
        <strong>Success:</strong> {drill.successCriterion}
      </p>
    </div>
  );
}
