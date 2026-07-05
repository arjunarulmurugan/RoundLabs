# Arjun GitHub Handoff

Supersedes the earlier `ARJUN_HANDOFF.md`. Claude Code prepared files only —
**no remote changes, no push, no publish.**

## Current branch
`main` (local). No commits yet in this working session; all files are staged-as-untracked
in the working tree. **0 git remotes configured** (Arjun owns remote setup).

## Git status
22 untracked/modified paths. No history rewritten, no force-push, no remote added.

## Files changed (this phase — new)
`src/lib/config/iniEditor.ts`, `src/lib/config/valorantConfig.ts`,
`src/lib/video/videoAnalysis.ts`, `src/lib/router/hashRouter.ts`,
`src/components/valorant/ConfigWorkspace.tsx`, `src/components/lab/UnfinishedRegion.tsx`,
`src/components/input/MaterialInput.tsx`, `src/tests/configEditor.test.ts`,
`src/tests/videoAnalysis.test.ts`, `.env.example`,
`.github/workflows/deploy-pages.yml` (renamed from deploy.yml),
`docs/{FINAL_INTEGRATION_BASELINE,VIDEO_ANALYSIS_DEPLOYMENT,GITHUB_DEPLOYMENT,DSI_ARCHITECTURE}.md`.
Edited: `src/App.tsx` (hash router), `src/components/compiler/ClayCompiler.tsx`
(3.5s transform + skip + material input + navigate), `src/components/lab/{LabRenderer,MapBoard,Timeline}.tsx`,
`src/types/lab-spec.ts`, `src/data/scenarioRegistry.ts`, `src/styles.css`.

## Tests
61 passed / 0 failed (`bunx vitest run`).

## Type-check result
PASS (`bunx tsc -b --noEmit`, no errors).

## Build result
PASS (`bun run build` → `dist/`). Production preview served with a clean console.

## Output directory
`dist/` (single-page app; includes `.nojekyll`).

## Vite base behaviour
`base = process.env.VITE_BASE ?? "/"`. Local/dev + user/org pages = `/`; project page
needs `VITE_BASE=/<repo>/`. Verified: `VITE_BASE=/roundlabs/` rewrites asset URLs.

## GitHub workflow path
`.github/workflows/deploy-pages.yml` — `workflow_dispatch` only; `push` trigger is
commented out so nothing auto-runs until you opt in.

## Required Pages settings
Settings → Pages → Source: GitHub Actions. Add Actions **variable** `VITE_BASE`
(and optionally `VITE_VIDEO_ANALYSIS_ENDPOINT`). Then enable the push trigger or run
the workflow manually.

## Expected frontend URL
`https://<owner>.github.io/<repo>/` (project page) or `https://<owner>.github.io/`
(user/org page). Set `VITE_BASE` to match.

## Video endpoint deployment options
Separate serverless function (Vercel/Netlify/Cloudflare/Lambda) — see
`docs/VIDEO_ANALYSIS_DEPLOYMENT.md`. Frontend stays on Pages. Endpoint holds the
provider key; the browser only gets the URL.

## Required environment variables
- Client: `VITE_BASE`, `VITE_VIDEO_ANALYSIS_ENDPOINT` (URL only).
- Server (serverless fn, not the frontend): `PROVIDER_API_KEY`, `PROVIDER_MODEL`.

## Secret configuration
No secrets in the repo. `.env`, `.env.local`, `.env.*.local` are gitignored;
`.env.example` (no values) is tracked. Client never receives a provider key.

## Runtime fallbacks
- No video endpoint → honest manual timestamp/description path (never "AI analyzed").
- No GBrain → checked-in local grammar (GBrain CLI never runs in the browser).
- Unknown lab id / route → safe error page. Player Brain = localStorage.

## Smoke-test checklist (after publish)
1. Home (neutral clay) loads at the Pages URL.
2. Compile an example → ~3.5s transform → `#/lab/...` renders.
3. Refresh on `#/lab/...` stays on the lab (hash routing).
4. `#/valorant/config` → load sample → set DPI+target → diff → Download works.
5. Video button shows manual fallback when no endpoint is set.
6. Browser console clean; no request to a local GBrain.

## Confirmations
- Remotes were **not** changed (0 remotes; none added).
- **No real secret was committed** (verified by repo scan + a test scanning the client video lib).
