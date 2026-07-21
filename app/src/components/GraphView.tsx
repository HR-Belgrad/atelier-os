import { useMemo } from 'react';

import { GraphBuilder } from '../engine/graph/GraphBuilder';
import type { BaseObject } from '../engine/models/BaseObject';

interface GraphViewProps {
  objects: BaseObject[];
}

export function GraphView({ objects }: GraphViewProps) {
  const graph = useMemo(
    () => new GraphBuilder().build(objects),
    [objects],
  );

  const positionedNodes = useMemo(
    () =>
      graph.nodes.map((node, index) => {
        const columns = 4;
        const column = index % columns;
        const row = Math.floor(index / columns);

        return {
          ...node,
          x: 100 + column * 170,
          y: 80 + row * 120,
        };
      }),
    [graph.nodes],
  );

  const nodeById = useMemo(
    () => new Map(positionedNodes.map((node) => [node.id, node])),
    [positionedNodes],
  );

  if (objects.length === 0) {
    return (
      <section className="panel graph-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Wissensgraph</p>
            <h2>Beziehungen sichtbar machen</h2>
          </div>
        </div>

        <p>
          Öffne zuerst ein Repository, um den Wissensgraphen anzuzeigen.
        </p>
      </section>
    );
  }

  return (
    <section className="panel graph-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Wissensgraph</p>
          <h2>Beziehungen sichtbar machen</h2>
        </div>

        <span>
          {graph.nodes.length} Objekte · {graph.edges.length} Beziehungen
        </span>
      </div>

      <svg
        className="graph"
        viewBox="0 0 700 360"
        role="img"
        aria-label="Atelier Wissensgraph"
      >
        {graph.edges.map((edge) => {
          const source = nodeById.get(edge.source);
          const target = nodeById.get(edge.target);

          if (!source || !target) {
            return null;
          }

          return (
            <line
              key={edge.id}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
            />
          );
        })}

        {positionedNodes.map((node) => (
          <g
            key={node.id}
            className={`graph-node ${node.type}`}
            transform={`translate(${node.x} ${node.y})`}
          >
            <circle r={node.type === 'work' ? 42 : 31} />

            <text textAnchor="middle" dy="4">
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </section>
  );
}