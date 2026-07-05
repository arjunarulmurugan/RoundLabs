import type { GameRecognitionResult } from "../../lib/recognition/gameRecognizer";
import { explainRecognition } from "../../lib/recognition/gameRecognizer";
import { GAME_EXPERIENCE_PROFILES } from "../../config/gameExperienceProfiles";

// Unobtrusive recognition explanation. Never claims AI when deterministic
// matching was used — the wording comes from explainRecognition().
export function RecognitionBanner({ result }: { result: GameRecognitionResult }) {
  if (result.requiresConfirmation && !result.game) {
    return (
      <div className="recognition-banner needs-confirm" role="status">
        <strong>Game could not be identified confidently.</strong>
        <span>Choose Valorant, Pokémon, or F1.</span>
      </div>
    );
  }

  if (!result.game) return null;
  const label = GAME_EXPERIENCE_PROFILES[result.game].label;
  const methodTag = result.method === "explicit-selection" ? "selected" : "deterministic";

  return (
    <div className="recognition-banner" role="status" data-needs-confirm={result.requiresConfirmation}>
      <span className="recognition-line">
        <span className="recognition-key">Detected:</span> {label}
      </span>
      <span className="recognition-basis">{explainRecognition(result)}</span>
      <span className="recognition-method" title="How this was determined">
        {methodTag} · {(result.confidence * 100).toFixed(0)}% confidence
      </span>
      {result.requiresConfirmation && (
        <span className="recognition-warn">Ambiguous — please confirm the game.</span>
      )}
    </div>
  );
}
