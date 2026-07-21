import type { RelationType } from "../ontology/RelationType";

export interface Relation {
  type: RelationType;
  targetId: string;
  label?: string;
}