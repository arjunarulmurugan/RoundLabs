<div align="center">

# RoundLabs

### Decision training for competitive games

**One neutral interface material that reshapes itself into the right reasoning tool for the game.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Open_App-2ea44f?style=for-the-badge)](https://zesty-empanada-ec3c85.netlify.app/#/)
&nbsp;
![Tests](https://img.shields.io/badge/tests-61_passing-3fb950?style=for-the-badge)
&nbsp;
![Build](https://img.shields.io/badge/build-passing-3fb950?style=for-the-badge)

**▶ Live app:** https://zesty-empanada-ec3c85.netlify.app/#/

</div>

---

> *Aim trainers train your hands. RoundLabs trains your decisions.*

Competitive players can see **what** happened — accuracy, K/D, lap times, replays — but
most tools never explain **which decision caused the mistake**, what evidence was
available at that moment, or how to practise the missing skill.

**RoundLabs** turns one real match moment into an evidence-aware, interactive
**decision lab**: understand the mistake, compare alternatives with their consequences
and evidence, practise the missing decision skill with a targeted drill, and save the
lesson.

---

## ✨ The idea: Digital Clay

The interface is a single neutral material. You describe a match moment; it **recognises
the game and the decision structure**, then **reshapes itself in place** into a
game-specific reasoning instrument — no navigation to separate dashboards, no
spinner-then-new-page. One material, many forms.

```
Neutral input  →  recognise game  →  recognise decision  →  separate facts / unknowns
      →  select reasoning tools  →  reshape the surface  →  game-specific decision lab
```

The three environments feel **substantially different** — layout, density, typography,
terminology, evidence placement, interaction — while sharing one technical core.

| Game | Environment | Decision model |
|---|---|---|
| **Valorant** | Tactical command room **+ Configuration Diagnosis** | spatial / tactical & input-config decisions |
| **Competitive Pokémon** | Branching decision organism | hidden-information & win-condition decisions |
| **F1 racing** | Race-engineering workstation | telemetry & strategy decisions |

> Rocket League was intentionally removed — the product is focused on these three.

---

## 🔑 Key features

- **Digital Clay transformation** — a neutral surface visibly reshapes (~3.5s, skippable,
  reduced-motion aware) into the recognised game's environment.
- **Same game, different interface** — Valorant *retake* is map-dominant; Valorant
  *economy* drops the map for a decision tree. Same renderer, different composition.
- **Valorant config editor** — upload a plain-text config; it's parsed **in your
  browser**, edited safely (comments/order/unknown keys preserved), shown as a **diff**,
  and downloaded as a revised copy. Your original is **never overwritten or executed**.
- **Honest sensitivity help** — eDPI is only computed from *your* DPI + target. Missing a
  value? The region stays visibly **unfinished** and asks for it — no invented "optimal".
- **Structural missing-evidence** — incomplete evidence leaves a genuinely *unformed*
  region (what's missing, why, what completes it), not a polished panel with an "Unknown"
  badge.
- **Honest video pipeline** — local preview → optional serverless analysis endpoint →
  validated results; if no endpoint, an honest manual fallback that **never claims
  "AI analyzed"**. No API keys in the frontend.
- **Provenance everywhere** — every fact is `observed / user-reported / source-backed /
  inferred / unknown`, shown by glyph **+ text + colour** (never colour alone).
- **No fabricated data** — **0 invented numeric facts**; unknowns stay unknown;
  recommendations are projected analysis, not guaranteed outcomes.
- **Save Lesson** to a local Player Brain; **View LabSpec** to inspect the raw contract.

---

## 🧱 Architecture — one core, many forms

```
recognizeGame()            deterministic, explainable, never claims AI
      │
resolveScenario()          picks the decision model within a game
      │
LabSpec (validated)        one shared contract + runtime + provenance validation
      │
Component Registry         one safe, allow-listed set of components
      │
LabRenderer + GameShell    one renderer; game experience manifests drive composition
      │
Game-specific decision lab
```

**Shared across every game:** RoundLabs identity, LabSpec, validation, provenance,
component registry, LabRenderer, Player Brain, Save Lesson, View LabSpec, accessibility.
**Different per game:** layout grammar, density, component prominence, terminology,
evidence placement, drill format. There are **no separate game applications**.

More detail: [`docs/DSI_ARCHITECTURE.md`](docs/DSI_ARCHITECTURE.md) ·
[`docs/DIGITAL_CLAY_DESIGN_SYSTEM.md`](docs/DIGITAL_CLAY_DESIGN_SYSTEM.md) ·
[`docs/DATA_PROVENANCE.md`](docs/DATA_PROVENANCE.md)

---

## 🛠️ Tech stack

- **React 18 + TypeScript + Vite** — static single-page app
- **Bun** — package manager / task runner
- **Vitest** — 61 unit/integration tests
- **CSS custom properties + CSS Grid + lightweight SVG** — no UI framework, no charting
  library, no state-management library, **no runtime dependencies beyond React**
- **Hash routing** (dependency-free) — refresh- and deep-link-safe on any static host
- Persistence via **browser localStorage** (Player Brain)

---

## 🚀 Getting started

```bash
# install (Bun)
bun install

# run the dev server
bun run dev            # http://localhost:5178

# run the tests
bun run test           # 61 tests

# type-check + production build
bun run build          # outputs dist/
```

No `node`/`npm` required — the project runs on Bun. (Scripts also work under Node if you
prefer `npm install` / `npm run build`.)

---

## 🧭 Using the app

1. **Describe a match moment** (or click a *Try a moment* example), then **Compile**.
2. Watch the surface transform, then land in the game's decision lab.
3. **Valorant config:** go to `#/valorant/config` → *Use sample config* → enter DPI `800`
   and target eDPI `320` → *Apply as experiment* → see the one-line diff → **Download**
   `GameUserSettings.roundlabs.ini`.
4. Select different **alternatives / branches / strategies** and watch the surface
   re-emphasise (map markers, timeline, projected states).
5. **Save Lesson** and revisit under `#/lessons`.

Routes: `#/` · `#/lab/:id` · `#/lessons` · `#/valorant/config`.

---

## 📁 Project structure

```
src/
  components/
    compiler/     ClayCompiler — neutral input + in-place transformation
    input/        MaterialInput — text / image / video / config materials
    lab/          LabRenderer, GameShell, registry components, UnfinishedRegion
    valorant/     ConfigWorkspace — the config-diagnosis surface
  config/         gameExperienceProfiles — per-game manifests
  data/           scenarioRegistry + verified player-report scenarios
  lib/
    compiler/     buildLabSpec, validateLabSpec, validateProvenance
    config/       iniEditor (safe parse/edit), valorantConfig (eDPI, allow-list)
    recognition/  gameRecognizer (deterministic)
    router/       hashRouter (no dependency)
    video/        videoAnalysis (endpoint adapter + validation + fallback)
    memory/       Player Brain (local)
  types/          lab-spec, verified-scenario (shared contracts)
  tests/          61 tests
docs/             design system, architecture, provenance, deployment, workflow
```

---

## 🌐 Deployment

Live on **Netlify**:
**https://zesty-empanada-ec3c85.netlify.app/#/**

It's a static build, so it deploys anywhere:

- **Netlify** — drag `dist/` onto [app.netlify.com/drop](https://app.netlify.com/drop),
  or connect the repo (`netlify.toml` included).
- **Vercel** — `bunx vercel --prod` (`vercel.json` included).
- **GitHub Pages** — workflow at `.github/workflows/deploy-pages.yml`; set
  `VITE_BASE=/<repo>/`. See [`docs/GITHUB_DEPLOYMENT.md`](docs/GITHUB_DEPLOYMENT.md).

Hash routing means refresh and deep links work with **no server rewrite rules**.
Optional real video analysis runs on a **separate serverless endpoint** (frontend never
holds a key) — see [`docs/VIDEO_ANALYSIS_DEPLOYMENT.md`](docs/VIDEO_ANALYSIS_DEPLOYMENT.md).

---

## ✅ Testing

```bash
bun run test        # 61 tests, all passing
```

Coverage includes: LabSpec + provenance validation, game recognition, experience
profiles, config round-trip isolation (only intended lines change), binary-file
rejection, no-fabricated-sensitivity rules, video file/response validation, endpoint
fallback, and a scan proving no provider secret ships in the client.

---

## 🔍 Honest notes

- The bundled scenarios and sample config are **illustrative player-reports**
  (`approvedForDemo: false`) with **zero fabricated numbers** — real sourced data can
  replace them without code changes.
- Real video analysis needs a deployed endpoint; without it the honest manual fallback
  is used.
- Player Brain is per-browser (localStorage), not a cloud account.

---

## 📚 Documentation

| Doc | What it covers |
|---|---|
| [`PRODUCT.md`](PRODUCT.md) | Product overview |
| [`DESIGN.md`](DESIGN.md) · [`docs/DIGITAL_CLAY_DESIGN_SYSTEM.md`](docs/DIGITAL_CLAY_DESIGN_SYSTEM.md) | Design system |
| [`docs/DSI_ARCHITECTURE.md`](docs/DSI_ARCHITECTURE.md) | Architecture |
| [`docs/DATA_PROVENANCE.md`](docs/DATA_PROVENANCE.md) | No-fabrication / provenance rules |
| [`DEMO.md`](DEMO.md) · [`PITCH.md`](PITCH.md) | Demo flow & pitch |
| [`docs/GITHUB_DEPLOYMENT.md`](docs/GITHUB_DEPLOYMENT.md) · [`docs/VIDEO_ANALYSIS_DEPLOYMENT.md`](docs/VIDEO_ANALYSIS_DEPLOYMENT.md) | Deployment |

---

<div align="center">

**RoundLabs** — turn one match moment into a decision you can practise.

</div>
