import { useState } from 'react';
import { GraphView } from './components/GraphView';
import { recentObjects } from './data/mock';

type Section = 'Dashboard' | 'Werke' | 'Musik' | 'Wissen' | 'Bibliothek' | 'Graph';
const sections: Section[] = ['Dashboard', 'Werke', 'Musik', 'Wissen', 'Bibliothek', 'Graph'];

export default function App() {
  const [active, setActive] = useState<Section>('Dashboard');
  const [repository, setRepository] = useState<string | null>(null);

  async function chooseRepository() {
    const path = await window.atelier.chooseRepository();
    if (path) setRepository(path);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">A</span>
          <div><strong>Atelier</strong><small>Creative OS</small></div>
        </div>
        <nav>
          {sections.map((section) => (
            <button key={section} className={active === section ? 'active' : ''} onClick={() => setActive(section)}>
              {section}
            </button>
          ))}
        </nav>
        <div className="repo-card">
          <small>Repository</small>
          <strong>{repository ? repository.split('/').pop() : 'Nicht verbunden'}</strong>
          <button onClick={chooseRepository}>{repository ? 'Wechseln' : 'Öffnen'}</button>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <div><p className="eyebrow">Atelier OS · v0.2</p><h1>{active}</h1></div>
          <button className="primary-button" onClick={chooseRepository}>Repository öffnen</button>
        </header>

        {active === 'Graph' ? <GraphView /> : (
          <div className="dashboard-grid">
            <section className="hero panel">
              <p className="eyebrow">Willkommen zurück</p>
              <h2>Deine Arbeit bleibt im Zusammenhang.</h2>
              <p>Atelier verbindet Werke, Szenen, Musik, Wissen und Werkzeuge in einem gemeinsamen kreativen Gedächtnis.</p>
              <div className="hero-actions"><button className="primary-button">Weiter an Szene 4</button><button className="ghost-button">Neue Idee</button></div>
            </section>

            <section className="panel stats">
              <div><strong>3</strong><span>aktive Werke</span></div>
              <div><strong>17</strong><span>offene Ideen</span></div>
              <div><strong>42</strong><span>Beziehungen</span></div>
            </section>

            <section className="panel recent">
              <div className="panel-heading"><div><p className="eyebrow">Zuletzt bearbeitet</p><h2>Aktuelle Objekte</h2></div></div>
              {recentObjects.map((item) => (
                <button className="object-row" key={item.title}>
                  <span className="type-pill">{item.type}</span>
                  <span><strong>{item.title}</strong><small>{item.detail}</small></span>
                  <span aria-hidden="true">→</span>
                </button>
              ))}
            </section>

            <GraphView />
          </div>
        )}
      </main>
    </div>
  );
}
