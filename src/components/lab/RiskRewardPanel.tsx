import type { LabComponentProps } from "./componentProps";

// Compares alternatives on risk vs reward without inventing precise numbers
// (master prompt §18). Uses the qualitative levels from the LabSpec.
export function RiskRewardPanel({ spec, component }: LabComponentProps) {
  return (
    <div className="lab-card risk-reward">
      <h3>{component.title}</h3>
      <table className="risk-table">
        <thead>
          <tr>
            <th>Alternative</th>
            <th>Risk</th>
            <th>Reward</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {spec.alternatives.map((a) => (
            <tr key={a.id} className={`rating-${a.rating}`}>
              <td>{a.label}</td>
              <td>{a.risk}</td>
              <td>{a.reward}</td>
              <td>{a.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
