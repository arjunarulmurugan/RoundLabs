import type { CSSProperties, ReactNode } from "react";
import type { GameExperienceProfile } from "../../config/gameExperienceProfiles";

// Applies a game's experience manifest to the DOM: theme tokens as CSS custom
// properties + layout/density data attributes that the stylesheet keys off to
// produce a substantially different composition. This is the ONE place game
// identity turns into presentation — there are no per-game page components.
export function GameShell({
  profile,
  children,
}: {
  profile: GameExperienceProfile;
  children: ReactNode;
}) {
  const style = {
    "--game-surface": profile.themeTokens.surfaceStyle,
    "--game-border": profile.themeTokens.borderStyle,
    "--game-accent": profile.themeTokens.accentStyle,
    "--game-heading-font": profile.themeTokens.headingStyle,
    "--game-data-font": profile.themeTokens.dataStyle,
  } as CSSProperties;

  return (
    <div
      className={`game-shell layout-${profile.layout} density-${profile.density}`}
      data-layout={profile.layout}
      data-density={profile.density}
      data-game={profile.game}
      style={style}
    >
      {children}
    </div>
  );
}
