// RoundLabs — safe in-browser config (INI/CFG/TXT) editor core.
//
// Guarantees (proved by round-trip tests):
//  - Parsing then serialising with NO changes returns byte-identical text.
//  - Comments, blank lines, ordering, section headers, and unknown keys are
//    preserved exactly.
//  - Only the value portion of an explicitly changed key is rewritten; the key,
//    its separator formatting, and every other line stay untouched.
//  - Pure text. Never uses eval. Never executes uploaded content.

export const SUPPORTED_CONFIG_EXTENSIONS = [".ini", ".cfg", ".txt"];
export const DEFAULT_MAX_CONFIG_BYTES = 2 * 1024 * 1024; // 2 MB

export interface ConfigFileValidation {
  ok: boolean;
  error?: string;
}

const BINARY_ERROR =
  "This looks like a binary file, not a text config. Upload a plain-text .ini, .cfg, or .txt.";

// Detects binary content by scanning for control bytes that never appear in a
// plain-text config: NUL (0) through unit-separator (31), excluding tab (9),
// line feed (10), and carriage return (13). Avoids embedding literal control
// characters in source.
function looksBinary(text: string): boolean {
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c < 32 && c !== 9 && c !== 10 && c !== 13) return true;
  }
  return false;
}

// Rejects executables/binaries/archives and oversized files. We never execute the
// file — this only decides whether to parse it as text.
export function validateConfigFile(
  fileName: string,
  text: string,
  opts: { maxBytes?: number; byteLength?: number } = {},
): ConfigFileValidation {
  const lower = fileName.toLowerCase();
  if (!SUPPORTED_CONFIG_EXTENSIONS.some((ext) => lower.endsWith(ext))) {
    return { ok: false, error: `Unsupported file type. RoundLabs edits plain-text config only (${SUPPORTED_CONFIG_EXTENSIONS.join(", ")}).` };
  }
  if (looksBinary(text)) {
    return { ok: false, error: BINARY_ERROR };
  }
  const size = opts.byteLength ?? text.length;
  const maxBytes = opts.maxBytes ?? DEFAULT_MAX_CONFIG_BYTES;
  if (size > maxBytes) {
    return { ok: false, error: `Config file is too large (limit ${Math.round(maxBytes / 1024)} KB).` };
  }
  return { ok: true };
}

export type ConfigLineKind = "comment" | "section" | "kv" | "blank" | "other";

export interface ConfigLine {
  raw: string;
  kind: ConfigLineKind;
  section?: string; // section this line belongs to ("" = top-level)
  key?: string;
  value?: string;
  pre?: string; // leading whitespace before key
  sep?: string; // exact separator between key and value (e.g. "=", " = ")
}

export interface ConfigDoc {
  lines: ConfigLine[];
  eol: "\n" | "\r\n";
  trailingNewline: boolean;
}

const COMMENT_RE = /^\s*[;#]/;
const SECTION_RE = /^\s*\[(.+?)\]\s*$/;
// key, separator (spaces + '=' + spaces), value (rest)
const KV_RE = /^(\s*)([^=\s][^=]*?)(\s*=\s*)(.*)$/;

export function parseConfig(text: string): ConfigDoc {
  const eol: "\n" | "\r\n" = text.includes("\r\n") ? "\r\n" : "\n";
  const trailingNewline = /\r?\n$/.test(text);
  const body = trailingNewline ? text.replace(/\r?\n$/, "") : text;
  const rawLines = body.length === 0 ? [] : body.split(/\r\n|\n/);

  let currentSection = "";
  const lines: ConfigLine[] = rawLines.map((raw) => {
    if (raw.trim() === "") return { raw, kind: "blank", section: currentSection };
    if (COMMENT_RE.test(raw)) return { raw, kind: "comment", section: currentSection };
    const sec = raw.match(SECTION_RE);
    if (sec) {
      currentSection = sec[1];
      return { raw, kind: "section", section: currentSection };
    }
    const kv = raw.match(KV_RE);
    if (kv) {
      return {
        raw,
        kind: "kv",
        section: currentSection,
        pre: kv[1],
        key: kv[2],
        sep: kv[3],
        value: kv[4],
      };
    }
    return { raw, kind: "other", section: currentSection };
  });

  return { lines, eol, trailingNewline };
}

export function serializeConfig(doc: ConfigDoc): string {
  const joined = doc.lines.map((l) => l.raw).join(doc.eol);
  return doc.trailingNewline ? joined + doc.eol : joined;
}

export interface KvRef {
  section: string;
  key: string;
  value: string;
}

export function listSettings(doc: ConfigDoc): KvRef[] {
  return doc.lines
    .filter((l) => l.kind === "kv")
    .map((l) => ({ section: l.section ?? "", key: l.key!, value: l.value! }));
}

export function getValue(doc: ConfigDoc, key: string, section?: string): string | undefined {
  const line = doc.lines.find(
    (l) => l.kind === "kv" && l.key === key && (section === undefined || (l.section ?? "") === section),
  );
  return line?.value;
}

// Returns a NEW doc with the given key's value replaced. Only that key's line raw
// is rebuilt (pre + key + sep + newValue); all other lines are shared by reference
// and remain byte-identical on serialise.
export function setValue(
  doc: ConfigDoc,
  key: string,
  newValue: string,
  section?: string,
): ConfigDoc {
  let changed = false;
  const lines = doc.lines.map((l) => {
    if (
      !changed &&
      l.kind === "kv" &&
      l.key === key &&
      (section === undefined || (l.section ?? "") === section)
    ) {
      changed = true;
      return { ...l, value: newValue, raw: `${l.pre ?? ""}${l.key}${l.sep ?? "="}${newValue}` };
    }
    return l;
  });
  return { ...doc, lines };
}
