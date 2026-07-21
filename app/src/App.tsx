import { useState } from 'react';
import { GraphView } from './components/GraphView';
import { useRepository } from './hooks/useRepository';

type Section =
  | 'Dashboard'
  | 'Werke'
  | 'Musik'
  | 'Wissen'
  | 'Bibliothek'
  | 'Graph';

const sections: Section[] = [
  'Dashboard',
  'Werke',
  'Musik',
  'Wissen',
  'Bibliothek',
  'Graph',
];

export default function App() {
  const [active, setActive] = useState<Section>('Dashboard');
const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  const {
    repository,
    objects,
    loading,
    error,
    openRepository,
  } = useRepository();

  const recentObjects = [...objects]
    .sort((a, b) =>
      (b.modifiedAt ?? '').localeCompare(a.modifiedAt ?? ''),
    )
    .slice(0, 5);

  const activeWorks = objects.filter(
    (object) =>
      object.type === 'work' &&
      object.status !== 'archived',
  ).length;

  const openIdeas = objects.filter(
    (object) =>
      object.type === 'idea' &&
      object.status !== 'archived',
  ).length;

  const relationshipCount = objects.reduce(
    (total, object) =>
      total + object.links.length + object.relations.length,
    0,
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">A</span>

          <div>
            <strong>Atelier</strong>
            <small>Creative OS</small>
          </div>
        </div>

        <nav>
          {sections.map((section) => (
            <button
              key={section}
              className={active === section ? 'active' : ''}
              onClick={() => setActive(section)}
            >
              {section}
            </button>
          ))}
        </nav>

        <div className="repo-card">
          <small>Repository</small>

          <strong>
            {repository
              ? repository.repositoryName
              : 'Nicht verbunden'}
          </strong>

          {repository && (
            <small>{objects.length} Objekte geladen</small>
          )}

          <button
            onClick={openRepository}
            disabled={loading}
          >
            {loading
              ? 'Lädt...'
              : repository
                ? 'Wechseln'
                : 'Öffnen'}
          </button>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <div>
            <p className="eyebrow">Atelier OS · v0.3</p>
            <h1>{active}</h1>
          </div>

          <button
            className="primary-button"
            onClick={openRepository}
            disabled={loading}
          >
            {loading ? 'Repository wird geladen...' : 'Repository öffnen'}
          </button>
        </header>

        {error && (
          <section className="panel">
            <strong>Repository konnte nicht geöffnet werden</strong>
            <p>{error}</p>
          </section>
        )}

        {active === 'Graph' ? (
          <GraphView
  objects={objects}
  selectedObjectId={selectedObjectId}
  onSelectObject={setSelectedObjectId}
/>
        ) : (
          <div className="dashboard-grid">
            <section className="hero panel">
              <p className="eyebrow">
                {repository ? 'Repository verbunden' : 'Willkommen zurück'}
              </p>

              <h2>
                {repository
                  ? `${repository.repositoryName} ist geladen.`
                  : 'Deine Arbeit bleibt im Zusammenhang.'}
              </h2>

              <p>
                {repository
                  ? `${objects.length} Atelier-Objekte wurden aus deinen Markdown-Dateien erzeugt.`
                  : 'Öffne dein Atelier-Repository, um deine echten Inhalte zu laden.'}
              </p>

              <div className="hero-actions">
                <button
                  className="primary-button"
                  onClick={openRepository}
                  disabled={loading}
                >
                  {repository
                    ? 'Anderes Repository öffnen'
                    : 'Repository öffnen'}
                </button>
              </div>
            </section>

            <section className="panel stats">
              <div>
                <strong>{activeWorks}</strong>
                <span>aktive Werke</span>
              </div>

              <div>
                <strong>{openIdeas}</strong>
                <span>offene Ideen</span>
              </div>

              <div>
                <strong>{relationshipCount}</strong>
                <span>Beziehungen</span>
              </div>
            </section>

            <section className="panel recent">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Zuletzt bearbeitet</p>
                  <h2>Aktuelle Objekte</h2>
                </div>
              </div>

              {recentObjects.length === 0 ? (
                <p>
                  Noch keine Objekte geladen. Öffne zuerst ein Repository.
                </p>
              ) : (
                recentObjects.map((item) => (
                  <button
                    className="object-row"
                    key={item.id}
                  >
                    <span className="type-pill">
                      {item.type}
                    </span>

                    <span>
                      <strong>{item.title}</strong>
                      <small>{item.path}</small>
                    </span>

                    <span aria-hidden="true">→</span>
                  </button>
                ))
              )}
            </section>

            <GraphView
  objects={objects}
  selectedObjectId={selectedObjectId}
  onSelectObject={setSelectedObjectId}
/>
          </div>
        )}
      </main>
    </div>
  );
}