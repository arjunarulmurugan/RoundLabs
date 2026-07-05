// RoundLabs — provenance validation.
// Master prompt §10 (data-truth policy) + §15 (validation checklist).
//
// Enforces:
//  - Every fact carries a known status.
//  - Source references resolve to declared evidence.
//  - Inferred facts include confidence AND explanation.
//  - Unknowns are not disguised as facts (a fact may not both be status
//    "unknown" and carry a concrete non-null value).
//  - Non-unknown, non-user-reported facts are backed by evidence.

import type { EvidenceReference, ScenarioFact } from "../../types/verified-scenario";
import { fail, warn, type ValidationResult } from "./validationTypes";

const KNOWN_STATUSES = new Set([
  "observed",
  "user-reported",
  "source-backed",
  "inferred",
  "unknown",
]);

export function validateFactsProvenance(
  facts: ScenarioFact[],
  evidence: EvidenceReference[],
  result: ValidationResult,
  opts: { requireEvidenceForBackedFacts: boolean } = {
    requireEvidenceForBackedFacts: true,
  },
): void {
  const evidenceIds = new Set(evidence.map((e) => e.id));

  for (const fact of facts) {
    const path = `facts.${fact.id}`;

    if (!KNOWN_STATUSES.has(fact.status)) {
      fail(result, "fact.status.unknown", `Fact "${fact.id}" has unknown status "${fact.status}".`, path);
      continue;
    }

    // Broken source reference fails.
    for (const sid of fact.sourceIds) {
      if (!evidenceIds.has(sid)) {
        fail(result, "fact.source.broken", `Fact "${fact.id}" references missing evidence "${sid}".`, path);
      }
    }

    if (fact.status === "inferred") {
      if (typeof fact.confidence !== "number") {
        fail(result, "fact.inferred.confidence", `Inferred fact "${fact.id}" is missing a numeric confidence.`, path);
      } else if (fact.confidence < 0 || fact.confidence > 1) {
        fail(result, "fact.inferred.confidence.range", `Inferred fact "${fact.id}" confidence must be within 0..1.`, path);
      }
      if (!fact.explanation || fact.explanation.trim() === "") {
        fail(result, "fact.inferred.explanation", `Inferred fact "${fact.id}" is missing an explanation.`, path);
      }
    }

    if (fact.status === "unknown") {
      // Unknowns must not be disguised as facts by carrying a real value.
      if (fact.value !== null && fact.value !== "" && fact.value !== "Unknown") {
        fail(
          result,
          "fact.unknown.disguised",
          `Fact "${fact.id}" is marked unknown but carries a concrete value; unknowns must not be disguised as facts.`,
          path,
        );
      }
    }

    if (
      opts.requireEvidenceForBackedFacts &&
      (fact.status === "observed" || fact.status === "source-backed")
    ) {
      if (fact.sourceIds.length === 0) {
        fail(
          result,
          "fact.backed.no-source",
          `Fact "${fact.id}" is "${fact.status}" but has no supporting evidence reference.`,
          path,
        );
      }
    }

    if (fact.status === "user-reported" && fact.sourceIds.length === 0) {
      warn(
        result,
        "fact.user-reported.no-source",
        `User-reported fact "${fact.id}" has no linked player-report evidence.`,
        path,
      );
    }
  }
}
