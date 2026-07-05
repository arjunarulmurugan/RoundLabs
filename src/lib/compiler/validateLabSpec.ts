// RoundLabs — LabSpec runtime validation.
// Master prompt §15 checklist. Returns a controlled ValidationResult; never throws.

import {
  LAB_COMPONENT_TYPES,
  SUPPORTED_GAME_IDS,
  type LabSpec,
} from "../../types/lab-spec";
import { fail, emptyResult, type ValidationResult } from "./validationTypes";
import { validateFactsProvenance } from "./validateProvenance";

const COMPONENT_TYPE_SET = new Set<string>(LAB_COMPONENT_TYPES);
const GAME_SET = new Set<string>(SUPPORTED_GAME_IDS);

export interface ValidateOptions {
  // Demo-ready labs must carry evidence and resolvable sources. A raw
  // deterministic-parser draft may relax this until approved.
  demoReady?: boolean;
}

export function validateLabSpec(
  spec: LabSpec,
  options: ValidateOptions = { demoReady: true },
): ValidationResult {
  const result = emptyResult();
  const demoReady = options.demoReady ?? true;

  // Version + game.
  if (spec.version !== "1.0") {
    fail(result, "version.unsupported", `Unsupported LabSpec version "${spec.version}".`);
  }
  if (!GAME_SET.has(spec.game)) {
    fail(result, "game.unsupported", `Unsupported game "${spec.game}".`);
  }

  // Required non-empty text fields.
  if (!spec.title || spec.title.trim() === "") {
    fail(result, "title.empty", "LabSpec title must be non-empty.");
  }
  if (!spec.decisionQuestion || spec.decisionQuestion.trim() === "") {
    fail(result, "decisionQuestion.empty", "Decision question must be non-empty.");
  }

  // Evidence for demo-ready labs.
  if (demoReady && spec.evidence.length === 0) {
    fail(result, "evidence.missing", "A demo-ready lab must include at least one evidence reference.");
  }

  // Provenance of facts (also resolves source references + inference labels).
  validateFactsProvenance(spec.facts, spec.evidence, result, {
    requireEvidenceForBackedFacts: demoReady,
  });

  // Components: approved names, unique ids, valid non-negative order.
  const seenComponentIds = new Set<string>();
  for (const c of spec.components) {
    if (!COMPONENT_TYPE_SET.has(c.type)) {
      fail(result, "component.unsupported", `Unsupported component type "${c.type}" (id "${c.id}").`, `components.${c.id}`);
    }
    if (seenComponentIds.has(c.id)) {
      fail(result, "component.id.duplicate", `Duplicate component id "${c.id}".`, `components.${c.id}`);
    }
    seenComponentIds.add(c.id);
    if (!Number.isFinite(c.order) || c.order < 0) {
      fail(result, "component.order.invalid", `Component "${c.id}" has invalid order "${c.order}".`, `components.${c.id}`);
    }
  }

  // Alternatives: at least two, unique ids, consequence + reasoning, evidence
  // or an explicit insufficient-evidence state.
  if (spec.alternatives.length < 2) {
    fail(result, "alternatives.tooFew", "A lab must offer at least two alternatives.");
  }
  const seenAltIds = new Set<string>();
  for (const alt of spec.alternatives) {
    const path = `alternatives.${alt.id}`;
    if (seenAltIds.has(alt.id)) {
      fail(result, "alternative.id.duplicate", `Duplicate alternative id "${alt.id}".`, path);
    }
    seenAltIds.add(alt.id);
    if (!alt.consequence || alt.consequence.trim() === "") {
      fail(result, "alternative.consequence.empty", `Alternative "${alt.id}" is missing a consequence.`, path);
    }
    if (!alt.reasoning || alt.reasoning.trim() === "") {
      fail(result, "alternative.reasoning.empty", `Alternative "${alt.id}" is missing reasoning.`, path);
    }
    if (alt.supportingFactIds.length === 0 && alt.rating !== "insufficient-evidence") {
      fail(
        result,
        "alternative.support.missing",
        `Alternative "${alt.id}" has no supporting evidence and is not marked insufficient-evidence.`,
        path,
      );
    }
    for (const fid of alt.supportingFactIds) {
      if (!spec.facts.some((f) => f.id === fid)) {
        fail(result, "alternative.support.broken", `Alternative "${alt.id}" references missing fact "${fid}".`, path);
      }
    }
  }

  // Recommendation must resolve.
  if (spec.recommendedAlternativeId !== undefined) {
    if (!spec.alternatives.some((a) => a.id === spec.recommendedAlternativeId)) {
      fail(result, "recommendation.invalid", `recommendedAlternativeId "${spec.recommendedAlternativeId}" does not match any alternative.`);
    }
  }

  // Drill must exist and be meaningful.
  if (!spec.drill || !spec.drill.title || spec.drill.title.trim() === "") {
    fail(result, "drill.missing", "A lab must include a drill with a title.");
  } else if (!spec.drill.successCriterion || spec.drill.successCriterion.trim() === "") {
    fail(result, "drill.successCriterion.missing", "Drill must include a success criterion.");
  }

  // Memory summary must exist.
  if (!spec.memorySummary || spec.memorySummary.trim() === "") {
    fail(result, "memorySummary.missing", "A lab must include a memory summary.");
  }

  return result;
}
