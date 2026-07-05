import type { GameExperienceProfile } from "../../config/gameExperienceProfiles";
import { GameShell } from "./GameShell";

// Polished, game-specific insufficient-evidence state. Rendered inside the
// game's own layout shell so Pokémon/F1 feel like their real environment even
// before a verified scenario exists — without inventing any match data.
export function GameEmptyState({
  profile,
  profileSource,
}: {
  profile: GameExperienceProfile;
  profileSource: "gbrain" | "local-fallback";
}) {
  return (
    <GameShell profile={profile}>
      <div className="lab-renderer empty-experience">
        <header className="lab-header">
          <div className="lab-header-top">
            <span className="lab-game">{profile.label}</span>
            <span className="lab-experience-name">{profile.experienceName}</span>
            <span className="lab-genmethod">
              profile: {profileSource === "gbrain" ? "GBrain" : "local"}
            </span>
          </div>
          <h1>{profile.emptyState.title}</h1>
        </header>

        <div className="empty-body">
          <p className="empty-description">{profile.emptyState.description}</p>

          <div className="empty-preview" aria-hidden="true">
            <span className="empty-preview-label">Decision model</span>
            <strong>{profile.decisionModel}</strong>
            <ul className="empty-component-hints">
              {profile.primaryComponentTypes.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>

          <p className="empty-honest">
            No facts, positions, or telemetry are shown because none have been
            verified. RoundLabs shows <code>Awaiting verified scenario data</code>{" "}
            rather than a fabricated example.
          </p>
        </div>
      </div>
    </GameShell>
  );
}
