export const OBJECT_TYPES = [
  "work",
  "scene",
  "chapter",
  "figure",
  "motif",
  "song",
  "album",
  "lyric",
  "sound",
  "synth",
  "effect",
  "knowledge",
  "decision",
  "idea",
  "location",
  "reference",
  "tool",
  "unknown",
] as const;

export type ObjectType = (typeof OBJECT_TYPES)[number];

export function isObjectType(value: unknown): value is ObjectType {
  return (
    typeof value === "string" &&
    OBJECT_TYPES.includes(value as ObjectType)
  );
}

export function normalizeObjectType(value: unknown): ObjectType {
  if (typeof value !== "string") {
    return "unknown";
  }

  const normalized = value.trim().toLowerCase();

  return isObjectType(normalized) ? normalized : "unknown";
}