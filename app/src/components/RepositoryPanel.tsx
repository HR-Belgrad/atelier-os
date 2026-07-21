import type { OpenRepositorySuccess } from '../types/repository';

interface RepositoryPanelProps {
  repository: OpenRepositorySuccess | null;
  loading: boolean;
  error: string | null;
  onOpen: () => void;
}

export function RepositoryPanel({
  repository,
  loading,
  error,
  onOpen,
}: RepositoryPanelProps) {
  return (
    <section className="repository-panel">
      <div>
        <span className="eyebrow">Repository</span>
        <strong>{repository?.repositoryName ?? 'Nicht verbunden'}</strong>
        {repository ? (
          <small>{repository.filesFound} Markdown-Dateien erkannt</small>
        ) : (
          <small>Wähle den Ordner mit deinen Atelier-Daten.</small>
        )}
        {error ? <small className="error-text">{error}</small> : null}
      </div>

      <button type="button" onClick={onOpen} disabled={loading}>
        {loading ? 'Wird geladen …' : repository ? 'Wechseln' : 'Öffnen'}
      </button>
    </section>
  );
}
