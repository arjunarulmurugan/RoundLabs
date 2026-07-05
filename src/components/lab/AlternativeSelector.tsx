import type { LabComponentProps } from "./componentProps";

// Real interactive comparison. Selecting an alternative changes the displayed
// consequence and reasoning (master prompt §17.9–.11).
export function AlternativeSelector({
  spec,
  component,
  selectedAlternativeId,
  onSelectAlternative,
}: LabComponentProps) {
  const selected =
    spec.alternatives.find((a) => a.id === selectedAlternativeId) ?? spec.alternatives[0];

  return (
    <div className="lab-card alternative-selector">
      <h3>{component.title}</h3>

      <div className="alt-buttons">
        {spec.alternatives.map((a) => {
          const isSelected = a.id === selected?.id;
          const isRecommended = a.id === spec.recommendedAlternativeId;
          return (
            <button
              key={a.id}
              className={`alt-button rating-${a.rating}${isSelected ? " selected" : ""}`}
              onClick={() => onSelectAlternative(a.id)}
              aria-pressed={isSelected}
            >
              <span className="alt-label">{a.label}</span>
              {isRecommended && <span className="rec-tag">Recommended</span>}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="alt-detail" data-testid="alt-detail">
          <p className="alt-summary">{selected.summary}</p>
          <div className="alt-meta">
            <span>Risk: {selected.risk}</span>
            <span>Reward: {selected.reward}</span>
            <span>Rating: {selected.rating}</span>
          </div>
          <p>
            <strong>Consequence:</strong> {selected.consequence}
          </p>
          <p>
            <strong>Reasoning:</strong> {selected.reasoning}
          </p>
          {selected.assumptions.length > 0 && (
            <p className="alt-assumptions">
              <strong>Assumes:</strong> {selected.assumptions.join("; ")}
            </p>
          )}
          <p className="alt-support">
            <strong>Supported by facts:</strong>{" "}
            {selected.supportingFactIds.length > 0
              ? selected.supportingFactIds.join(", ")
              : "insufficient evidence"}
          </p>
        </div>
      )}
    </div>
  );
}
