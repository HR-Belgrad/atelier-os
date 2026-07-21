/// <reference types="vite/client" />

import type { OpenRepositoryResult } from './types/repository';

declare global {
  interface Window {
    atelier: {
      openRepository: () => Promise<OpenRepositoryResult>;
    };
  }
}

export {};
