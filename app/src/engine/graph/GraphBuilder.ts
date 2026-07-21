import type { BaseObject } from "../models/BaseObject";
import type { RelationType } from "../ontology/RelationType";

export type GraphEdgeType = RelationType | "wiki-link";

export interface GraphNode {
  id: string;
  label: string;
  type: BaseObject["type"];
  status?: BaseObject["status"];
  path: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: GraphEdgeType;
  label?: string;
}

export interface ObjectGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphBuilderOptions {
  includeWikiLinks?: boolean;
  includeRelations?: boolean;
}

export class GraphBuilder {
  private readonly includeWikiLinks: boolean;
  private readonly includeRelations: boolean;

  constructor(options: GraphBuilderOptions = {}) {
    this.includeWikiLinks = options.includeWikiLinks ?? true;
    this.includeRelations = options.includeRelations ?? true;
  }

  build(objects: BaseObject[]): ObjectGraph {
    const nodes = objects.map((object) => this.toNode(object));
    const edges: GraphEdge[] = [];

    const objectById = new Map(
      objects.map((object) => [object.id, object]),
    );

    const objectByTitle = new Map(
      objects.map((object) => [
        this.normalize(object.title),
        object,
      ]),
    );

    for (const object of objects) {
      if (this.includeRelations) {
        this.addRelationEdges(object, objectById, edges);
      }

      if (this.includeWikiLinks) {
        this.addWikiLinkEdges(object, objectByTitle, edges);
      }
    }

    return {
      nodes,
      edges: this.deduplicateEdges(edges),
    };
  }

  private addRelationEdges(
    object: BaseObject,
    objectById: Map<string, BaseObject>,
    edges: GraphEdge[],
  ): void {
    for (const relation of object.relations) {
      if (!objectById.has(relation.targetId)) {
        continue;
      }

      edges.push({
        id: this.edgeId(
          object.id,
          relation.targetId,
          relation.type,
        ),
        source: object.id,
        target: relation.targetId,
        type: relation.type,
        label: relation.label,
      });
    }
  }

  private addWikiLinkEdges(
    object: BaseObject,
    objectByTitle: Map<string, BaseObject>,
    edges: GraphEdge[],
  ): void {
    for (const link of object.links) {
      const target = objectByTitle.get(this.normalize(link));

      if (!target || target.id === object.id) {
        continue;
      }

      edges.push({
        id: this.edgeId(
          object.id,
          target.id,
          "wiki-link",
        ),
        source: object.id,
        target: target.id,
        type: "wiki-link",
      });
    }
  }

  private toNode(object: BaseObject): GraphNode {
    return {
      id: object.id,
      label: object.title,
      type: object.type,
      status: object.status,
      path: object.path,
    };
  }

  private deduplicateEdges(
    edges: GraphEdge[],
  ): GraphEdge[] {
    const uniqueEdges = new Map<string, GraphEdge>();

    for (const edge of edges) {
      uniqueEdges.set(edge.id, edge);
    }

    return [...uniqueEdges.values()];
  }

  private edgeId(
    source: string,
    target: string,
    type: GraphEdgeType,
  ): string {
    return `${source}::${type}::${target}`;
  }

  private normalize(value: string): string {
    return value.trim().toLowerCase();
  }
}

export default GraphBuilder;