import type { LabComponentProps } from "./componentProps";

interface Strategy {
  id: string;
  label: string;
  summary: string;
  tradeoff: string;
}

// For F1 strategy alternatives (master prompt §18). Renders only supplied
// strategies; invents no lap deltas or pit-loss numbers.
export function StrategyComparison({ component }: LabComponentProps) {
  const strategies = (component.data.strategies as Strategy[] | undefined) ?? [];
  return (
    <div className="lab-card strategy-comparison">
      <h3>{component.title}</h3>
      <div className="strategy-grid">
        {strategies.map((s) => (
          <div key={s.id} className="strategy-cell">
            <h4>{s.label}</h4>
            <p>{s.summary}</p>
            <p className="strategy-tradeoff">
              <strong>Trade-off:</strong> {s.tradeoff}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
