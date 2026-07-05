# ROUNDLABS — SOLO CLAUDE CODE MASTER IMPLEMENTATION PROMPT

You are Claude Code acting as the lead engineer for **RoundLabs**.

The human operator is **Yuvaraj Singh Mattu**. ChatGPT is the product, research, review, and decision-support partner. Yuvaraj will run commands, provide files, test the application, and relay compact handoffs between you and ChatGPT.

This document is the complete source of truth for:

- The product idea
- The judge-facing value proposition
- The measurable numbers
- The no-fabrication policy
- The four-game scope
- The technical architecture
- GStack and GBrain usage
- The implementation sequence
- Testing
- Demo preparation
- Validation experiments
- Final acceptance criteria

Do not redesign the product.

Do not suggest a different product.

Do not reopen brainstorming.

Do not create separate hardcoded applications for each game.

Do not fabricate match data, telemetry, statistics, player history, outcomes, improvement claims, or market validation.

Do not stop after writing a plan. Inspect the repository and begin implementation.

---

# 0. FIRST ACTION

Before editing files:

1. Inspect the repository.
2. Check `git status`, the active branch, and uncommitted work.
3. Locate and read:
   - `CLAUDE.md`
   - `PRODUCT.md`
   - `TASKS.md`
   - `DEMO.md`
   - `PITCH.md`
   - `HANDOFF.md`
   - `docs/`
   - GStack-related files
   - GBrain configuration or commands
4. Discover the actual installed GStack workflow. Do not invent commands.
5. Retrieve the relevant RoundLabs Product Truth and Current Integration State from GBrain.
6. Run the current development and build commands.
7. Preserve useful working code.
8. Create a concise implementation checklist.
9. Begin the first vertical slice immediately.

Your first response must use:

```text
REPOSITORY STATE:
CURRENT STACK:
CURRENTLY WORKING:
CURRENTLY BROKEN:
GSTACK WORKFLOW FOUND:
GBRAIN CONTEXT RETRIEVED:
FILES I WILL CHANGE:
FILES I WILL NOT CHANGE:
FIRST VERTICAL SLICE:
VERIFICATION COMMAND:
```

Ask Yuvaraj a question only when a genuine external dependency blocks progress.

---

# 1. PRODUCT NAME

## RoundLabs

Use **RoundLabs** consistently in the interface, documentation, demo, and pitch.

Tagline:

> Decision training for competitive games.

Closing line:

> Aim trainers train your hands. RoundLabs trains your decisions.

---

# 2. ONE-SENTENCE PRODUCT DESCRIPTION

> RoundLabs turns a real competitive-gaming match moment into an evidence-aware interactive decision lab where the player can understand the mistake, compare alternative choices, practise the missing decision skill, and save the lesson for future training.

---

# 3. THE PROBLEM

Competitive players often know that they lost a round, battle, race, fight, or match.

Current tools may show:

- Accuracy
- Damage
- Kill/death ratio
- Win rate
- Position history
- Lap times
- Replay timelines
- Heat maps
- Generic coaching advice
- Long video reviews

These tools usually explain **what happened**, but not:

> Which decision caused the mistake, what information was available at the moment, what alternatives existed, and how should that decision be practised?

Different games require different reasoning interfaces:

- Valorant requires spatial positioning, teammate timing, utility, angles, and a tactical timeline.
- Competitive Pokémon requires branching options, revealed information, prediction evidence, and win-condition preservation.
- Rocket League requires rotation roles, field positioning, boost, challenge timing, and recovery risk.
- F1 racing games require lap and stint timelines, tyres, traffic, weather, pit windows, ERS, fuel, and strategy comparison.

One generic dashboard cannot represent all these decision structures well.

---

# 4. THE SOLUTION

RoundLabs converts one real match moment into a custom decision-training workspace.

The player can:

1. Submit a natural-language account, screenshot, replay note, clip, telemetry export, battle log, or public source.
2. See which information is observed, reported, sourced, inferred, or unknown.
3. Review a game-appropriate interactive workspace.
4. Compare at least three alternatives when enough evidence exists.
5. See the consequence, reasoning, assumptions, and evidence for each alternative.
6. Receive one targeted drill.
7. Save the lesson to Player Brain.
8. Use repeated mistake patterns to guide future training.

RoundLabs is not merely a chatbot.

The key product is the **generated interactive decision interface**.

---

# 5. JUDGE-FACING VALUE PROPOSITION

The judge asked:

> What value are you providing, and what numbers justify it?

RoundLabs provides four measurable forms of value.

## 5.1 Faster review

Target:

> Convert one raw match moment into a validated decision lab in under 60 seconds.

The application must measure the actual elapsed time from submission to rendered lab.

Do not claim under 60 seconds unless the measured build achieves it.

Display:

```text
Processing time: 38.4 seconds
```

or the actual measured result.

## 5.2 More actionable output

Every complete lab should provide:

- At least **3 decision alternatives**, when evidence supports them
- Consequences for each alternative
- Supporting evidence
- Visible unknowns and assumptions
- **1 targeted drill**
- **1 compact learning record**

If evidence supports only two alternatives, show two rather than inventing a third.

## 5.3 Cross-game scalability

The technical scalability claim must be visible:

- **4 game environments**
- **1 shared LabSpec**
- **1 shared LabRenderer**
- **1 constrained component registry**
- Approximately **10 reusable components**

Adding a game should primarily require:

- A verified scenario packet
- A component configuration
- Optional new generic component support

It should not require rebuilding another application.

## 5.4 Trust and provenance

Target:

- **100% provenance coverage** for displayed match facts
- **0 fabricated numeric facts**
- Every unsupported field marked `unknown`
- Every inference labelled and confidence-scored
- Maximum **1 AI repair attempt**
- No execution of generated frontend code

These are product rules, not marketing decoration.

---

# 6. NUMERIC CLAIMS ALLOWED IN THE DEMO

The following numbers may be used because they are product architecture facts or explicit validation targets:

| Metric | Number |
|---|---:|
| Supported game environments | 4 |
| Shared LabSpec definitions | 1 |
| Shared renderers | 1 |
| Approved reusable component types | About 10 |
| Alternatives per complete lab | Target 3 |
| Targeted drills per lab | 1 |
| Target generation time | Under 60 seconds |
| AI repair attempts | Maximum 1 |
| Allowed fabricated numeric facts | 0 |
| Desired provenance coverage | 100% |
| Pilot size | 5 users × 2 scenarios = 10 reviews |
| Target review-time reduction | At least 70% |
| Target post-lab decision recognition | At least 80% |

The pilot results are **targets until measured**.

Never present targets as achieved results.

---

# 7. SAME-DAY VALIDATION EXPERIMENT

Build a lightweight benchmark workflow so Yuvaraj can produce real numbers before judging.

## 7.1 Manual baseline

For one real scenario, ask a tester to manually produce:

- The decision mistake
- Three alternatives
- A recommended action
- A drill

Record time in seconds.

## 7.2 RoundLabs result

Run the same scenario through RoundLabs.

Record:

- Processing time
- Number of alternatives
- Number of sourced facts
- Number of unsupported facts
- Whether the user identifies the stronger decision
- Whether the user can explain the mistake afterward

## 7.3 Calculation

```text
Review-time reduction =
(Manual median time − RoundLabs median time)
÷ Manual median time × 100
```

## 7.4 Required benchmark output

Create one of:

- `BENCHMARK.md`
- `benchmark-results.json`
- A small in-app Validation panel

It must clearly distinguish:

- Measured result
- Sample size
- Target
- Not yet measured

Example:

```text
Pilot status: 4/10 reviews completed
Manual median: 11m 20s
RoundLabs median: 43.8s
Measured review-time reduction: 93.6%
Decision recognition after lab: 3/4
Fabricated numeric facts: 0
```

Do not show example values until actually measured.

---

# 8. BUSINESS VALUE SCENARIO

Use a transparent pricing scenario, not a fake forecast.

Hypothetical individual plan:

```text
$8 per month
```

Illustrative annual recurring revenue:

- 10,000 paying users = **$960,000 ARR**
- 100,000 paying users = **$9.6 million ARR**

These are arithmetic scenarios, not evidence of demand.

Label them:

```text
Illustrative pricing scenario
```

Potential buyers:

- Competitive players
- Amateur esports teams
- University esports clubs
- Coaches
- Training communities

---

# 9. PRIMARY TECHNICAL THESIS

RoundLabs is a **Dynamic Software Interface** product.

The flow is:

```text
Real match moment
        ↓
Evidence and provenance extraction
        ↓
Facts, unknowns, and inferences
        ↓
Validated LabSpec
        ↓
Safe component registry
        ↓
Shared LabRenderer
        ↓
Game-specific decision workspace
        ↓
Alternative comparison
        ↓
Targeted drill
        ↓
Player Brain record
```

The match moment becomes the specification.

The interface is compiled from the specification.

---

# 10. NON-NEGOTIABLE DATA-TRUTH POLICY

Do not fabricate:

- Match events
- Positions
- Health
- Boost
- Utility
- Move sets
- Damage rolls
- Lap times
- Tyre degradation
- Pit-loss estimates
- Weather
- Gaps
- ERS
- Fuel
- Outcomes
- Player history
- Improvement percentages
- Training results
- Confidence scores

Allowed source types:

1. Player report
2. Uploaded image
3. Uploaded video
4. Replay log
5. Telemetry
6. Battle log
7. Public source with reference

Every fact must use one status:

- `observed`
- `user-reported`
- `source-backed`
- `inferred`
- `unknown`

Inference requirements:

- Supporting evidence
- Explanation
- Confidence
- Visible inference label

When evidence is absent:

```text
Unknown
```

Do not insert plausible values.

Recommendations are projected analysis, not guaranteed outcomes.

---

# 11. SUPPORTED GAMES

The prototype supports:

1. Valorant
2. Competitive Pokémon
3. Rocket League
4. F1 racing game

The application should show all four game entries.

At least two must be fully working and evidence-backed.

The remaining games may use:

- A verified real scenario
- A user-reported real scenario
- An honest `Awaiting verified scenario data` state

Do not present invented scenario details as real matches.

---

# 12. GAME-SPECIFIC DECISION ENVIRONMENTS

## 12.1 Valorant

Suitable decisions:

- Retake timing
- Trade timing
- Utility sequencing
- Entry path
- Rotation
- Site hold positioning
- Economy decision

Typical components:

- `map-board`
- `timeline`
- `information-card`
- `alternative-selector`
- `risk-reward`
- `evidence-panel`
- `drill-card`

## 12.2 Competitive Pokémon

Suitable decisions:

- Switching
- Win-condition preservation
- Prediction risk
- Move selection
- Resource management
- Endgame sequencing

Typical components:

- `decision-tree`
- `information-card`
- `risk-reward`
- `alternative-selector`
- `evidence-panel`
- `drill-card`

Do not invent hidden moves, items, abilities, or damage rolls.

## 12.3 Rocket League

Suitable decisions:

- Last-defender positioning
- Rotation
- Boost route
- Challenge timing
- Recovery
- Overcommit recognition

Typical components:

- `map-board`
- `timeline`
- `decision-tree`
- `risk-reward`
- `alternative-selector`
- `evidence-panel`
- `drill-card`

## 12.4 F1 racing game

Suitable decisions:

- Pit-stop timing
- Tyre choice
- Tyre management
- Undercut or overcut
- Safety-car strategy
- Wet-weather strategy
- ERS deployment
- Fuel management
- Overtake timing
- Defensive risk

Typical components:

- `timeline`
- `telemetry-panel`
- `strategy-comparison`
- `information-card`
- `risk-reward`
- `alternative-selector`
- `evidence-panel`
- `drill-card`

Do not invent:

- Lap time
- Tyre age
- Tyre wear
- Pit loss
- Weather
- Gaps
- Damage
- ERS
- Fuel

---

# 13. VERIFIED SCENARIO PACKET

Implement:

```ts
type SourceType =
  | "player-report"
  | "uploaded-image"
  | "uploaded-video"
  | "replay-log"
  | "telemetry"
  | "battle-log"
  | "public-source";

type FactStatus =
  | "observed"
  | "user-reported"
  | "source-backed"
  | "inferred"
  | "unknown";

interface EvidenceReference {
  id: string;
  sourceType: SourceType;
  title: string;
  reporter?: string;
  url?: string;
  fileName?: string;
  timestampOrLocation?: string;
  notes?: string;
}

interface ScenarioFact {
  id: string;
  label: string;
  value: string | number | boolean | null;
  unit?: string;
  status: FactStatus;
  sourceIds: string[];
  confidence?: number;
  explanation?: string;
}

interface VerifiedScenarioPacket {
  id: string;
  game: "valorant" | "pokemon" | "rocket-league" | "f1";
  title: string;
  rawPlayerDescription?: string;
  evidence: EvidenceReference[];
  facts: ScenarioFact[];
  unknowns: string[];
  approvedForDemo: boolean;
  approvedBy?: string;
}
```

A packet is demo-ready only when:

- A source exists
- Important facts have source references
- Unknowns remain visible
- Inferences are labelled
- No unsupported number is inserted
- Yuvaraj approves it

---

# 14. LABSPEC

Implement one shared contract.

```ts
type GameId =
  | "valorant"
  | "pokemon"
  | "rocket-league"
  | "f1"
  | "other";

type LabComponentType =
  | "map-board"
  | "decision-tree"
  | "timeline"
  | "risk-reward"
  | "information-card"
  | "alternative-selector"
  | "telemetry-panel"
  | "strategy-comparison"
  | "evidence-panel"
  | "drill-card";

type GenerationMethod =
  | "verified-prepared"
  | "ai-generated"
  | "deterministic-parser";

type AlternativeRating =
  | "recommended"
  | "viable"
  | "risky"
  | "critical-error"
  | "insufficient-evidence";

type RiskLevel =
  | "low"
  | "moderate"
  | "high"
  | "very-high"
  | "unknown";

type RewardLevel =
  | "low"
  | "moderate"
  | "high"
  | "unknown";

interface LabComponentSpec {
  id: string;
  type: LabComponentType;
  title: string;
  order: number;
  width?: "full" | "half" | "third";
  data: Record<string, unknown>;
}

interface Alternative {
  id: string;
  label: string;
  summary: string;
  risk: RiskLevel;
  reward: RewardLevel;
  rating: AlternativeRating;
  consequence: string;
  reasoning: string;
  supportingFactIds: string[];
  assumptions: string[];
}

interface DrillSpec {
  id: string;
  title: string;
  objective: string;
  steps: string[];
  successCriterion: string;
}

interface LabSpec {
  version: "1.0";

  id: string;
  game: GameId;
  gameLabel: string;
  title: string;

  sourceInput?: string;
  generationMethod: GenerationMethod;

  playerGoal: string;
  situationSummary: string;
  mistakeCategory: string;
  decisionQuestion: string;

  evidence: EvidenceReference[];
  facts: ScenarioFact[];
  unknowns: string[];
  assumptions: string[];

  components: LabComponentSpec[];

  alternatives: Alternative[];
  recommendedAlternativeId?: string;

  drill: DrillSpec;
  memorySummary: string;
}
```

Do not duplicate the schema.

---

# 15. VALIDATION

Use runtime validation.

Check:

- Supported version
- Supported game
- Non-empty title
- Non-empty decision question
- Evidence exists for demo-ready labs
- Source references resolve
- Approved truth labels
- Inferences include confidence and explanation
- Unknowns are not disguised as facts
- Approved component names only
- Unique component IDs
- Valid component order
- At least two alternatives
- Unique alternative IDs
- Consequence and reasoning for each alternative
- Supporting evidence or explicit insufficient-evidence state
- Valid recommendation ID
- Drill exists
- Memory summary exists

Invalid output must return a controlled error.

It must never crash the app.

---

# 16. SAFE COMPONENT REGISTRY

Use one registry:

```ts
const componentRegistry = {
  "map-board": MapBoard,
  "decision-tree": DecisionTree,
  "timeline": Timeline,
  "risk-reward": RiskRewardPanel,
  "information-card": InformationCard,
  "alternative-selector": AlternativeSelector,
  "telemetry-panel": TelemetryPanel,
  "strategy-comparison": StrategyComparison,
  "evidence-panel": EvidencePanel,
  "drill-card": DrillCard,
};
```

AI may choose registered components.

AI may not generate executable UI code.

Unknown components fail validation.

---

# 17. SHARED LAB RENDERER

Create one `LabRenderer`.

It must:

1. Receive a validated `LabSpec`
2. Sort components
3. Resolve components through the registry
4. Render different game layouts
5. Display game, title, mistake category, and decision question
6. Display generation method
7. Display evidence
8. Distinguish facts, inferences, assumptions, and unknowns
9. Maintain selected-alternative state
10. Show consequence and reasoning
11. Show the recommendation only when supported
12. Display the drill
13. Allow `View LabSpec`
14. Allow `Save Lesson`
15. Handle component errors safely
16. Contain no game-specific page hardcoding

---

# 18. REQUIRED COMPONENTS

## MapBoard

For spatial decisions.

## DecisionTree

For branches and projected consequences.

## Timeline

For event sequence and decision timing.

## RiskRewardPanel

For comparing alternatives without false precision.

## InformationCard

For facts, resources, and unknowns.

## AlternativeSelector

For real interactive comparison.

## TelemetryPanel

For sourced F1 values. Unknown fields display `Unknown`.

## StrategyComparison

For F1 strategy alternatives.

## EvidencePanel

Required for every complete lab.

## DrillCard

Shows objective, steps, and success criterion.

---

# 19. NATURAL-LANGUAGE COMPILER

Input:

```ts
interface CompileScenarioInput {
  text: string;
  reporter?: string;
  evidence?: EvidenceReference[];
}
```

Output:

```ts
interface CompileScenarioResult {
  labSpec?: LabSpec;
  generationMethod:
    | "ai-generated"
    | "deterministic-parser";
  validationWarnings?: string[];
  insufficientEvidence?: string[];
}
```

Rules:

1. Preserve original text.
2. Extract supported facts only.
3. Mark uncertainty.
4. Mark missing values unknown.
5. Ask for clarification only when essential.
6. Generate alternatives from evidence.
7. Explain assumptions.
8. Select allowed components.
9. Generate a drill.
10. Validate output.
11. Attempt one repair.
12. Return controlled insufficiency after failure.
13. Never invent a complete scenario to avoid an error.

---

# 20. PLAYER BRAIN

Implement:

```ts
interface LearningRecord {
  id: string;
  createdAt: string;
  game: string;
  scenarioTitle: string;
  mistakeCategory: string;
  sourceIds: string[];
  selectedAlternativeId?: string;
  recommendedAlternativeId?: string;
  betterAlternativeSummary?: string;
  assumptions: string[];
  unknowns: string[];
  drillTitle: string;
  drillCompleted?: boolean;
  playerConfidence?: number;
  memorySummary: string;
}

interface PlayerBrain {
  save(record: LearningRecord): Promise<void>;
  list(): Promise<LearningRecord[]>;
}
```

Do not fabricate:

- Improvement
- Confidence
- Drill completion
- Repeated pattern

These require user action or saved history.

---

# 21. GBRAIN — REQUIRED

Use GBrain as shared memory.

Required project nodes or equivalents:

```text
RoundLabs / Product Truth
RoundLabs / LabSpec v1
RoundLabs / Data Provenance Policy
RoundLabs / Component Registry
RoundLabs / Verified Scenario Packets
RoundLabs / Current Integration State
RoundLabs / Claude Code Handoffs
RoundLabs / Validation Results
```

At session start:

1. Retrieve Product Truth.
2. Retrieve LabSpec.
3. Retrieve Current Integration State.
4. Retrieve latest Claude Code handoff.

At milestone end:

1. Write files changed.
2. Write commit.
3. Write tests run.
4. Write measured results.
5. Write blockers.
6. Update integration state.

Product memory architecture:

```text
PlayerBrain interface
        ↓
GBrainPlayerBrain
        ↓
LocalPlayerBrain fallback
```

If GBrain fails:

- Save locally
- Show honest sync state
- Do not claim successful GBrain write

---

# 22. GSTACK — REQUIRED

Use the actual installed GStack workflow.

Do not invent commands.

Use GStack for:

- Context restoration
- Specification alignment
- Implementation
- Review
- Testing
- Integration
- Shipping

At the beginning:

1. Inspect the environment for GStack.
2. Read installed commands or documentation.
3. Use only real commands.
4. Record the workflow used in `docs/GSTACK_WORKFLOW.md`.

If GStack is unavailable:

- Record the exact blocker
- Continue using repository files and GBrain
- Do not falsely claim GStack use

Do not spend the build window running every possible GStack workflow.

Use the smallest useful workflow for the current task.

---

# 23. YUVARAJ + CLAUDE CODE + CHATGPT WORKFLOW

Claude Code handles repository implementation.

ChatGPT handles:

- Product decisions
- Judge-value framing
- Research questions
- Scope cuts
- Review
- Error interpretation
- Demo script
- Pitch
- Validation-experiment design

At the end of each major phase, update:

```text
CHATGPT_HANDOFF.md
```

Use:

```markdown
# ChatGPT Handoff

## Phase

## What works

## Files changed

## Commands run

## Tests passed

## Tests failed

## Actual measured timings

## Current screenshots or behaviour

## Blocker

## Exact decision needed from ChatGPT

## Next implementation step
```

When blocked, do not send the entire terminal history.

Provide:

- First meaningful error
- Relevant file
- Expected behaviour
- Attempted fix
- Current Git state

Yuvaraj will bring that handoff to ChatGPT and return the decision.

---

# 24. IMPLEMENTATION ORDER

## Phase 1 — Repository and contracts

1. Inspect repository.
2. Discover GStack.
3. Retrieve GBrain.
4. Run current app.
5. Implement or confirm:
   - `VerifiedScenarioPacket`
   - `LabSpec`
   - Runtime validation
   - Provenance validation
6. Add tests.
7. Update GBrain and `CHATGPT_HANDOFF.md`.

## Phase 2 — First complete vertical slice

Build one evidence-backed lab end to end:

1. Verified packet
2. Valid LabSpec
3. Shared registry
4. Shared renderer
5. Evidence panel
6. Alternative interaction
7. Drill
8. Player Brain save
9. Measured processing time

Do not build all four games before one full vertical slice works.

## Phase 3 — Second structurally different game

Use a game requiring different components.

Recommended pairing:

- Valorant + Pokémon
- Or Valorant + F1

Prove:

- Same LabSpec
- Same renderer
- Different component arrangement

## Phase 4 — F1

Implement:

- `TelemetryPanel`
- `StrategyComparison`
- Verified F1 scenario packet
- Unknown-value handling
- No invented telemetry

## Phase 5 — Remaining game entries

Add Rocket League and the remaining game path.

If verified data is missing:

```text
Awaiting verified scenario data
```

Do not invent.

## Phase 6 — Natural-language compiler

Add:

- Input
- Source/reporter field
- AI generation
- Validation
- One repair
- Controlled insufficiency
- Shared renderer

## Phase 7 — Benchmark

Add:

- Processing timer
- Manual baseline input
- Pilot progress
- Calculation
- Results export

## Phase 8 — Integration and demo

1. Run all tests.
2. Run type check.
3. Run production build.
4. Test reset path.
5. Test GBrain failure.
6. Test no API key.
7. Test invalid AI JSON.
8. Update `DEMO.md`.
9. Update `PITCH.md`.
10. Update `BENCHMARK.md`.
11. Update GBrain.
12. Produce final `CHATGPT_HANDOFF.md`.

---

# 25. REPOSITORY STRUCTURE

Adapt to the existing project.

Suggested:

```text
src/
  types/
    lab-spec.ts
    verified-scenario.ts

  data/
    verified-scenarios/
      valorant.ts
      pokemon.ts
      rocket-league.ts
      f1.ts

  components/
    lab/
      LabRenderer.tsx
      MapBoard.tsx
      DecisionTree.tsx
      Timeline.tsx
      RiskRewardPanel.tsx
      InformationCard.tsx
      AlternativeSelector.tsx
      TelemetryPanel.tsx
      StrategyComparison.tsx
      EvidencePanel.tsx
      DrillCard.tsx
      LabSpecViewer.tsx

  registry/
    componentRegistry.ts

  lib/
    compiler/
      compileScenario.ts
      validateLabSpec.ts
      validateProvenance.ts
      deterministicParser.ts

    memory/
      playerBrain.ts
      gbrainPlayerBrain.ts
      localPlayerBrain.ts

    benchmark/
      benchmark.ts

docs/
  LABSPEC.md
  DATA_PROVENANCE.md
  GSTACK_WORKFLOW.md
  GBRAIN_STRUCTURE.md

PRODUCT.md
TASKS.md
DEMO.md
PITCH.md
BENCHMARK.md
CHATGPT_HANDOFF.md
HANDOFF.md
CLAUDE.md
```

---

# 26. TESTING

Required tests:

1. Valid evidence-backed LabSpec passes.
2. Missing evidence fails for demo-ready lab.
3. Broken source reference fails.
4. Inferred fact without confidence fails.
5. Inferred fact without explanation fails.
6. Unknown value displays `Unknown`.
7. Unsupported component fails.
8. One-alternative lab fails.
9. Invalid recommendation ID fails.
10. Missing drill fails.
11. Components render in order.
12. Alternative selection changes reasoning.
13. Evidence panel renders.
14. F1 telemetry does not invent absent values.
15. Empty input returns controlled error.
16. Invalid AI JSON does not crash.
17. No API key uses a safe path.
18. GBrain failure uses honest local fallback.
19. Player Brain save works.
20. Processing time is measured.
21. Production build passes.

---

# 27. HOME SCREEN

Display:

- RoundLabs
- Tagline
- Short product explanation
- Four game cards
- Natural-language input
- Reporter/source field
- Generate button
- Recent lessons
- Validation metrics summary

Suggested value summary:

```text
4 game environments
1 shared decision engine
Evidence-linked facts
0 fabricated numeric data
Target: under 60 seconds per lab
```

Do not show a target as an achieved result.

---

# 28. DEMO FLOW

Target: approximately 90 seconds.

## 0–12 seconds — Problem

> Competitive players can see what happened, but most tools do not explain which decision caused the mistake or what evidence was available at the moment.

## 12–24 seconds — Value

> RoundLabs targets under 60 seconds to turn one real match moment into a decision lab with alternatives, evidence, and a targeted drill.

Show the actual measured time.

## 24–42 seconds — First verified lab

Show:

- Source
- Facts
- Unknowns
- Game-specific components
- Three alternatives
- Recommended decision
- Drill

## 42–57 seconds — Cross-game proof

Switch to a structurally different game.

Explain:

> Both labs use one LabSpec and one renderer, but the interface changes because the decision problem changes.

## 57–70 seconds — F1

Show:

- Telemetry
- Strategy comparison
- Unknown fields
- No fabricated values

## 70–81 seconds — Natural-language generation

Submit a real user-reported moment.

Show:

- Fact extraction
- Unknowns
- Validation
- Dynamic interface

## 81–90 seconds — Value close

Show measured pilot numbers if available.

Close:

> Aim trainers train your hands. RoundLabs trains your decisions.

---

# 29. PITCH NUMBERS

Use this exact distinction.

## Architecture facts

- 4 game environments
- 1 shared LabSpec
- 1 shared renderer
- About 10 reusable component types
- Maximum 1 AI repair
- 0 fabricated numeric facts allowed

## Product targets

- Under 60-second lab generation
- 3 alternatives per complete lab
- 1 drill per lab
- 100% provenance coverage
- At least 70% review-time reduction
- At least 80% post-lab decision recognition

## Measured results

Only numbers actually produced by `BENCHMARK.md`.

## Pricing scenario

- $8/month
- 10,000 users = $960,000 ARR
- 100,000 users = $9.6 million ARR

Label pricing as illustrative.

---

# 30. ACCEPTANCE CRITERIA

The product is acceptable when:

- The application starts.
- Production build passes.
- RoundLabs home screen appears.
- Four games are visible.
- At least two evidence-backed labs render.
- All labs use one shared renderer.
- Different games use different component arrangements.
- Evidence sources are visible.
- Facts, inferences, assumptions, and unknowns are distinct.
- Unsupported values remain unknown.
- At least two alternatives can be compared.
- A recommendation is evidence-linked.
- A drill appears.
- F1 has telemetry or strategy-specific UI.
- Natural-language input works.
- Invalid AI output does not crash.
- Processing time is measured.
- Benchmark results distinguish targets from measured results.
- GStack usage is documented.
- GBrain is used for Product Truth and handoffs.
- Player Brain writes to GBrain or honest local fallback.
- No fabricated data is shown.
- Demo claims match actual behaviour.

---

# 31. CUT ORDER

If time is limited, cut in this order:

1. Extra animation
2. Additional scenarios per game
3. Rich charts
4. Coach dashboard
5. Multiple Player Brain views
6. Full live AI generation
7. Fourth complete lab
8. Third complete lab

Never cut:

- Shared LabSpec
- Shared renderer
- Provenance
- Evidence panel
- Runtime validation
- One complete vertical slice
- Second structurally different lab
- Processing timer
- Honest benchmark labels
- Production build

---

# 32. FINAL ENGINEERING RULES

- Inspect before editing.
- Use real GStack commands only.
- Retrieve and update GBrain.
- Preserve useful code.
- Build one complete vertical slice first.
- Do not fabricate data.
- Do not fabricate value metrics.
- Do not present targets as results.
- Mark unknowns as unknown.
- Label inference.
- Use one LabSpec.
- Use one renderer.
- Use one safe registry.
- Never execute generated frontend code.
- Keep API keys server-side.
- Attempt one AI repair only.
- Use controlled insufficiency instead of fake completion.
- Measure actual processing time.
- Generate `BENCHMARK.md`.
- Update `CHATGPT_HANDOFF.md` after every major phase.
- Run tests and build.
- Do not stop after planning.
- Continue until acceptance criteria are met or a genuine external blocker exists.

Begin now.
