import type { LabComponentProps } from "./componentProps";

interface Branch {
  id: string;
  choice: string;
  projectedConsequence: string;
  children?: Branch[];
}

// Branches and projected consequences. Consequences are labelled as projected,
// not guaranteed (master prompt §10).
function BranchNode({ branch }: { branch: Branch }) {
  return (
    <li>
      <span className="branch-choice">{branch.choice}</span>
      <span className="branch-consequence">→ {branch.projectedConsequence} (projected)</span>
      {branch.children && branch.children.length > 0 && (
        <ul>
          {branch.children.map((c) => (
            <BranchNode key={c.id} branch={c} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function DecisionTree({ component }: LabComponentProps) {
  const branches = (component.data.branches as Branch[] | undefined) ?? [];
  return (
    <div className="lab-card decision-tree">
      <h3>{component.title}</h3>
      {branches.length === 0 ? (
        <p className="empty-note">No branches provided.</p>
      ) : (
        <ul className="branch-list">
          {branches.map((b) => (
            <BranchNode key={b.id} branch={b} />
          ))}
        </ul>
      )}
    </div>
  );
}
