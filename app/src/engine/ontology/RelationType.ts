export const RELATION_TYPES = [
  "contains",
  "part-of",
  "follows",
  "precedes",

  "inspired-by",
  "inspires",
  "uses",
  "used-in",
  "created-with",
  "creates",
  "processed-by",
  "processes",
  "associated-with",

  "related-to",
  "refers-to",
  "applies-to",
  "supports",
  "contradicts",

  "appears-in",
  "knows",
  "loves",
  "opposes",
  "influences",
  "located-at",
  "takes-place-in",

  "based-on",
  "supersedes",
  "rejects",
  "becomes",
] as const;

export type RelationType = (typeof RELATION_TYPES)[number];

export function isRelationType(value: unknown): value is RelationType {
  return (
    typeof value === "string" &&
    RELATION_TYPES.includes(value as RelationType)
  );
}