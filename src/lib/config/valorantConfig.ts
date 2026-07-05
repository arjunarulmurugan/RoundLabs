// RoundLabs — Valorant config domain logic on top of the generic iniEditor.
// Only ALLOW-LISTED plain-text settings are recognised; every other key is left
// untouched. No "optimal" sensitivity is fabricated — recommendations are only
// produced from real inputs (uploaded value + user-reported DPI + target eDPI).

import type { ConfigDoc } from "./iniEditor";
import { getValue } from "./iniEditor";

export type ConfigChangeStatus = "recommended" | "accepted" | "rejected" | "manually-edited";

export interface ConfigSettingChange {
  key: string;
  section?: string;
  label: string;
  originalValue: string;
  proposedValue: string;
  status: ConfigChangeStatus;
  reason: string;
  evidenceIds: string[];
  assumptions: string[];
  // Present when this recommendation is a transparent experiment rather than a
  // claimed optimum, or when it cannot be computed yet.
  kind: "experiment" | "toggle" | "unavailable";
}

// Recognised, editable settings. Keys are matched against the uploaded file;
// unknown keys are never shown here and never modified.
export interface AllowedSetting {
  key: string;
  label: string;
  section?: string;
  role: "sensitivity" | "toggle" | "value";
}

export const VALORANT_ALLOWLIST: AllowedSetting[] = [
  { key: "MouseSensitivity", label: "In-game sensitivity", role: "sensitivity" },
  { key: "Sensitivity", label: "In-game sensitivity", role: "sensitivity" },
  { key: "ScopedSensitivity", label: "Scoped sensitivity multiplier", role: "value" },
  { key: "RawInput", label: "Raw input", role: "toggle" },
  { key: "MouseAcceleration", label: "Mouse acceleration", role: "toggle" },
];

export function computeEdpi(dpi: number, sensitivity: number): number {
  return Math.round(dpi * sensitivity * 100) / 100;
}

export function suggestSensForTargetEdpi(dpi: number, targetEdpi: number): number {
  return Math.round((targetEdpi / dpi) * 1000) / 1000;
}

// Detect which allow-listed settings are present in the uploaded file.
export function detectAllowedSettings(doc: ConfigDoc): Array<{ setting: AllowedSetting; value: string }> {
  const out: Array<{ setting: AllowedSetting; value: string }> = [];
  const seen = new Set<string>();
  for (const setting of VALORANT_ALLOWLIST) {
    const v = getValue(doc, setting.key);
    if (v !== undefined && !seen.has(setting.key)) {
      seen.add(setting.key);
      out.push({ setting, value: v });
    }
  }
  return out;
}

export interface SensitivityInputs {
  dpi?: number; // user-reported mouse DPI
  currentSensitivity?: number; // from file or user
  targetEdpi?: number; // explicit target
}

export interface SensitivityRecommendation {
  // Either a computed experiment or an explicit "unavailable" with the reason.
  status: "experiment" | "unavailable";
  currentEdpi?: number;
  suggestedSensitivity?: number;
  suggestedEdpi?: number;
  missing: string[]; // what is required before this can be produced
  reason: string;
  assumptions: string[];
}

// The core no-fabrication rule: without DPI (and a current sensitivity + target),
// we return an explicit "unavailable" describing what is missing — never a number.
export function recommendSensitivity(inputs: SensitivityInputs): SensitivityRecommendation {
  const missing: string[] = [];
  if (inputs.dpi === undefined || !Number.isFinite(inputs.dpi) || inputs.dpi <= 0) missing.push("Mouse DPI");
  if (inputs.currentSensitivity === undefined || !Number.isFinite(inputs.currentSensitivity)) missing.push("Current in-game sensitivity");

  if (missing.length > 0) {
    return {
      status: "unavailable",
      missing,
      reason:
        "RoundLabs will not invent a sensitivity. These values are required before an eDPI experiment can be calculated.",
      assumptions: [],
    };
  }

  const dpi = inputs.dpi as number;
  const currentSensitivity = inputs.currentSensitivity as number;
  const currentEdpi = computeEdpi(dpi, currentSensitivity);

  if (inputs.targetEdpi === undefined || !Number.isFinite(inputs.targetEdpi) || inputs.targetEdpi <= 0) {
    // We can show the current eDPI honestly, but a *suggested* value needs a target.
    return {
      status: "unavailable",
      currentEdpi,
      missing: ["Target eDPI (or an explicit adjustment you want to try)"],
      reason:
        "Your current eDPI is shown from your inputs. A suggested experiment needs a target eDPI you choose — RoundLabs does not assert an optimum.",
      assumptions: ["eDPI = DPI × in-game sensitivity."],
    };
  }

  const suggestedSensitivity = suggestSensForTargetEdpi(dpi, inputs.targetEdpi);
  return {
    status: "experiment",
    currentEdpi,
    suggestedSensitivity,
    suggestedEdpi: computeEdpi(dpi, suggestedSensitivity),
    missing: [],
    reason:
      "Suggested experiment: a sensitivity that reaches the target eDPI you chose. This is an experiment to try, not a claimed best value.",
    assumptions: ["eDPI = DPI × in-game sensitivity.", "Target eDPI was chosen by you."],
  };
}

export const REVISED_FILENAME_SUFFIX = ".roundlabs";

export function revisedFileName(original: string): string {
  const dot = original.lastIndexOf(".");
  if (dot <= 0) return `${original}${REVISED_FILENAME_SUFFIX}`;
  return `${original.slice(0, dot)}${REVISED_FILENAME_SUFFIX}${original.slice(dot)}`;
}
