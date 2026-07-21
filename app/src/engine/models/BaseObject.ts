import type { ObjectType } from "../ontology/ObjectType";
import type { Relation } from "./Relation";

export type AtelierObjectType = ObjectType;
export type AtelierRelation = Relation;

export type AtelierObjectStatus =
  | "idea"
  | "draft"
  | "active"
  | "paused"
  | "archived"
  | "canonical"
  | "published";

export interface BaseObject {
  id: string;
  type: ObjectType;
  title: string;
  path: string;

  status?: AtelierObjectStatus;
  summary?: string;

  tags: string[];
  aliases: string[];
  links: string[];
  relations: Relation[];

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
    object.relations.every(isRelation) &&
    typeof object.metadata === "object" &&
    object.metadata !== null
  );
}

function isRelation(value: unknown): value is Relation {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const relation = value as Partial<Relation>;

  return (
    typeof relation.type === "string" &&
    typeof relation.targetId === "string" &&
    (relation.label === undefined || typeof relation.label === "string")
  );
}