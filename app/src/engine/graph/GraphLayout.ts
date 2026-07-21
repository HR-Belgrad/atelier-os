import dagre from "@dagrejs/dagre";

import type {
  ObjectGraph,
  GraphNode,
} from "./GraphBuilder";

export interface PositionedGraphNode extends GraphNode {
  x: number;
  y: number;
}

export interface PositionedGraph
  extends Omit<ObjectGraph, "nodes"> {
  nodes: PositionedGraphNode[];
}

export class GraphLayout {
  layout(graph: ObjectGraph): PositionedGraph {
    const g = new dagre.graphlib.Graph();

    g.setGraph({
      rankdir: "LR",
      nodesep: 60,
      ranksep: 100,
    });

    g.setDefaultEdgeLabel(() => ({}));

    for (const node of graph.nodes) {
      g.setNode(node.id, {
        width: 120,
        height: 60,
      });
    }

    for (const edge of graph.edges) {
      g.setEdge(edge.source, edge.target);
    }

    dagre.layout(g);

    return {
      edges: graph.edges,
      nodes: graph.nodes.map((node) => {
        const position = g.node(node.id);

        return {
          ...node,
          x: position.x,
          y: position.y,
        };
      }),
    };
  }
}