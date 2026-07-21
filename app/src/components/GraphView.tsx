import type { BaseObject } from "../engine/models/BaseObject";
import { graphEdges, graphNodes } from '../data/mock';

interface GraphViewProps {
  objects: BaseObject[];
}
export function GraphView({ objects }: GraphViewProps) {
  const byId = new Map(graphNodes.map((node) => [node.id, node]));
  return (
    <section className="panel graph-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Wissensgraph</p>
          <h2>Beziehungen sichtbar machen</h2>
        </div>
        <button className="ghost-button">Filter</button>
      </div>
      <svg className="graph" viewBox="0 0 700 360" role="img" aria-label="Atelier Wissensgraph">
        {graphEdges.map(([sourceId, targetId]) => {
          const source = byId.get(sourceId)!;
          const target = byId.get(targetId)!;
          return <line key={`${sourceId}-${targetId}`} x1={source.x} y1={source.y} x2={target.x} y2={target.y} />;
        })}
        {graphNodes.map((node) => (
          <g key={node.id} className={`graph-node ${node.type}`} transform={`translate(${node.x} ${node.y})`}>
            <circle r={node.id === 'work' ? 42 : 31} />
            <text textAnchor="middle" dy="4">{node.label}</text>
          </g>
        ))}
      </svg>
    </section>
  );
}
