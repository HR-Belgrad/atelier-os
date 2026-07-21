import type { BaseObject } from "../models/BaseObject";

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
  type: string;
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

    const objectById = new Map(objects.map((object) => [object.id, object]));
    const objectByTitle = new Map(
      objects.map((object) => [this.normalize(object.title), object]),
    );

    for (const object of objects) {
      if (this.includeRelations) {
        for (const relation of object.relations) {
          if (!objectById.has(relation.targetId)) {
            continue;
          }

          edges.push({
            id: this.edgeId(object.id, relation.targetId, relation.type),
            source: object.id,
            target: relation.targetId,
            type: relation.type,
            label: relation.label,
          });
        }
      }

      if (this.includeWikiLinks) {
        for (const link of object.links) {
          const target = objectByTitle.get(this.normalize(link));

          if (!target || target.id === object.id) {
            continue;
          }

          edges.push({
            id: this.edgeId(object.id, target.id, "wiki-link"),
            source: object.id,
            target: target.id,
            type: "wiki-link",
          });
        }
      }
    }

    return {
      nodes,
      edges: this.deduplicateEdges(edges),
    };
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

  private deduplicateEdges(edges: GraphEdge[]): GraphEdge[] {
    const unique = new Map<string, GraphEdge>();

    for (const edge of edges) {
      unique.set(edge.id, edge);
    }

    return [...unique.values()];
  }

  private edgeId(source: string, target: string, type: string): string {
    return `${source}::${type}::${target}`;
  }

  private normalize(value: string): string {
    return value.trim().toLowerCase();
  }
}

export default GraphBuilder;
