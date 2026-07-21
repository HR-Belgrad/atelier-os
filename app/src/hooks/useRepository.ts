import { useCallback, useMemo, useState } from 'react';

import type { BaseObject } from '../engine/models/BaseObject';
import type { OpenRepositorySuccess } from '../types/repository';

export interface RepositoryState {
  repository: OpenRepositorySuccess | null;
  objects: BaseObject[];
  loading: boolean;
  error: string | null;
  openRepository: () => Promise<void>;
}

export function useRepository(): RepositoryState {
  const [repository, setRepository] = useState<OpenRepositorySuccess | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openRepository = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await window.atelier.openRepository();
      if (!result.canceled) setRepository(result);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Repository konnte nicht geöffnet werden.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const objects = useMemo(() => repository?.objects ?? [], [repository]);

  return {
    repository,
    objects,
    loading,
    error,
    openRepository,
  };
}
