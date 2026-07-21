import type { BaseObject } from "../engine/models/BaseObject";

interface InspectorProps {
  object: BaseObject | null;
}

export function Inspector({ object }: InspectorProps) {
  if (!object) {
    return (
      <aside className="panel">
        <h2>Inspector</h2>
        <p>Wähle einen Knoten aus.</p>
      </aside>
    );
  }

  return (
    <aside className="panel">
      <h2>Inspector</h2>

      <dl>
        <dt>Titel</dt>
        <dd>{object.title}</dd>

        <dt>Typ</dt>
        <dd>{object.type}</dd>

        <dt>Status</dt>
        <dd>{object.status ?? "—"}</dd>

        <dt>Pfad</dt>
        <dd>{object.path}</dd>

        <dt>Tags</dt>
        <dd>
          {object.tags.length > 0
            ? object.tags.join(", ")
            : "—"}
        </dd>

        <dt>Beziehungen</dt>
        <dd>{object.links.length + object.relations.length}</dd>
      </dl>
    </aside>
  );
}