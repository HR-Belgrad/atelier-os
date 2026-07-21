import { useMemo } from 'react';

import { GraphBuilder } from '../engine/graph/GraphBuilder';
import { GraphLayout } from '../engine/graph/GraphLayout';
import type { BaseObject } from '../engine/models/BaseObject';

interface GraphViewProps {
  objects: BaseObject[];
  selectedObjectId: string | null;
  onSelectObject: (id: string) => void;
}

export function GraphView({
  objects,
  selectedObjectId,
  onSelectObject,
}: GraphViewProps) {
  const graph = useMemo(
    () => new GraphBuilder().build(objects),
    [objects],
  );

  const positionedGraph = useMemo(
    () => new GraphLayout().layout(graph),
    [graph],
  );

  const positionedNodes = positionedGraph.nodes;

  const nodeById = useMemo(
    () => new Map(positionedNodes.map((node) => [node.id, node])),
    [positionedNodes],
  );

  const connectedNodeIds = useMemo(() => {
    const connectedIds = new Set<string>();

    if (!selectedObjectId) {
      return connectedIds;
    }

    for (const edge of graph.edges) {
      if (edge.source === selectedObjectId) {
        connectedIds.add(edge.target);
      }

      if (edge.target === selectedObjectId) {
        connectedIds.add(edge.source);
      }
    }

    return connectedIds;
  }, [graph.edges, selectedObjectId]);

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

        {positionedNodes.map((node) => {
          const isSelected = selectedObjectId === node.id;
          const isConnected = connectedNodeIds.has(node.id);

          const isDimmed =
            selectedObjectId !== null &&
            !isSelected &&
            !isConnected;

          return (
            <g
              key={node.id}
              className={`graph-node ${node.type} ${
                isSelected ? 'selected' : ''
              } ${isConnected ? 'connected' : ''} ${
                isDimmed ? 'dimmed' : ''
              }`}
              transform={`translate(${node.x} ${node.y})`}
              onClick={() => onSelectObject(node.id)}
              style={{
                cursor: 'pointer',
                opacity: isDimmed ? 0.35 : 1,
              }}
              role="button"
              tabIndex={0}
              aria-label={`${node.label} auswählen`}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelectObject(node.id);
                }
              }}
            >
              <circle
                r={node.type === 'work' ? 42 : 31}
                fill={isDimmed ? '#f3f3f3' : undefined}
                stroke={
                  isSelected
                    ? '#FE5A5D'
                    : isConnected
                      ? '#5B19DA'
                      : undefined
                }
                strokeWidth={
                  isSelected
                    ? 4
                    : isConnected
                      ? 3
                      : undefined
                }
              />

              <text textAnchor="middle" dy="4">
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </section>
  );
}