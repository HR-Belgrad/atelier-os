export type AtelierObjectType =
  | "work"
  | "scene"
  | "song"
  | "album"
  | "figure"
  | "motif"
  | "sound"
  | "synth"
  | "knowledge"
  | "decision"
  | "idea"
  | "location"
  | "tool"
  | "reference"
  | "unknown";

export type AtelierObjectStatus =
  | "idea"
  | "draft"
  | "active"
  | "paused"
  | "archived"
  | "canonical"
  | "published";

export interface AtelierRelation {
  type: string;
  targetId: string;
  label?: string;
}

export interface BaseObject {
  id: string;
  type: AtelierObjectType;
  title: string;
  path: string;

  status?: AtelierObjectStatus;
  summary?: string;

  tags: string[];
  aliases: string[];
  links: string[];
  relations: AtelierRelation[];

  createdAt?: string;
  modifiedAt?: string;

  metadata: Record<string, unknown>;
}

export function isBaseObject(value: unknown): value is BaseObject {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const object = value as Partial<BaseObject>;

  return (
    typeof object.id === "string" &&
    typeof object.type === "string" &&
    typeof object.title === "string" &&
    typeof object.path === "string" &&
    Array.isArray(object.tags) &&
    Array.isArray(object.aliases) &&
    Array.isArray(object.links) &&
    Array.isArray(object.relations) &&
    typeof object.metadata === "object" &&
    object.metadata !== null
  );
}
