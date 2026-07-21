import type { BaseObject } from '../engine/models/BaseObject';

export interface OpenRepositorySuccess {
  canceled: false;
  rootPath: string;
  repositoryName: string;
  scannedAt: string;
  filesFound: number;
  objects: BaseObject[];
}

export interface OpenRepositoryCanceled {
  canceled: true;
}

export type OpenRepositoryResult =
  | OpenRepositorySuccess
  | OpenRepositoryCanceled;
