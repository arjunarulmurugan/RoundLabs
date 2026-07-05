// Shared validation result shape. Validation NEVER throws — it returns a
// controlled result so the app can render an honest error instead of crashing.
// Master prompt §15: "Invalid output must return a controlled error. It must
// never crash the app."

export interface ValidationIssue {
  code: string;
  message: string;
  path?: string;
}

export interface ValidationResult {
  ok: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

export function emptyResult(): ValidationResult {
  return { ok: true, errors: [], warnings: [] };
}

export function fail(
  result: ValidationResult,
  code: string,
  message: string,
  path?: string,
): void {
  result.ok = false;
  result.errors.push({ code, message, path });
}

export function warn(
  result: ValidationResult,
  code: string,
  message: string,
  path?: string,
): void {
  result.warnings.push({ code, message, path });
}
