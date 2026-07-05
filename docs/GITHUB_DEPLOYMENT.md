# GitHub Pages Deployment

Static frontend only. No backend, DB, GBrain CLI, PGLite, or dev server required at
runtime. Everything except real video analysis works offline of any endpoint.

## Build
- `bun install`
- `bunx vitest run` (61 tests)
- `bun run build` → `dist/` (single-page app + `.nojekyll`)
- Base path: `vite.config.ts` uses `VITE_BASE ?? "/"`.

## Routing on Pages (why refresh "just works")
The app uses a **hash router** (`#/`, `#/lab/:id`, `#/lessons`, `#/valorant/config`).
Hash URLs never hit the server path, so direct links and refresh work on Pages with
**no 404.html rewrite**. Unknown lab ids render a safe "Unknown lab" page.

## Publish (Arjun owns this)
1. Settings → Pages → Source: **GitHub Actions**.
2. Settings → Secrets and variables → Actions → **Variables**: `VITE_BASE=/<repo>/`
   (omit or `/` for a user/org page). Optionally `VITE_VIDEO_ANALYSIS_ENDPOINT`.
3. `.github/workflows/deploy-pages.yml` has `push` commented out — enable it or run
   via Actions → "Deploy to GitHub Pages" → Run workflow.

## Verified locally
- `bun run build` passes.
- `VITE_BASE=/roundlabs/ bun run build` rewrites asset URLs to `/roundlabs/assets/…`.
- Production preview (`bun run preview`) served the built app with a clean console.
