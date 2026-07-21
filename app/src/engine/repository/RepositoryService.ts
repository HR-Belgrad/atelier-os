import { promises as fs } from "node:fs";
import path from "node:path";

export interface RepositoryFile {
  absolutePath: string;
  relativePath: string;
  name: string;
  extension: string;
  size: number;
  modifiedAt: string;
}

export interface RepositoryScanResult {
  rootPath: string;
  scannedAt: string;
  markdownFiles: RepositoryFile[];
  ignoredDirectories: string[];
}

export interface RepositoryServiceOptions {
  markdownExtensions?: string[];
  ignoredDirectories?: string[];
  followSymbolicLinks?: boolean;
}

const DEFAULT_MARKDOWN_EXTENSIONS = [".md", ".markdown"];

const DEFAULT_IGNORED_DIRECTORIES = [
  ".git",
  "node_modules",
  "dist",
  "build",
  ".vite",
  ".cache",
];

export class RepositoryService {
  private readonly markdownExtensions: Set<string>;
  private readonly ignoredDirectories: Set<string>;
  private readonly followSymbolicLinks: boolean;

  constructor(options: RepositoryServiceOptions = {}) {
    this.markdownExtensions = new Set(
      (options.markdownExtensions ?? DEFAULT_MARKDOWN_EXTENSIONS).map(
        (extension) => extension.toLowerCase(),
      ),
    );

    this.ignoredDirectories = new Set(
      options.ignoredDirectories ?? DEFAULT_IGNORED_DIRECTORIES,
    );

    this.followSymbolicLinks = options.followSymbolicLinks ?? false;
  }

  async scan(repositoryPath: string): Promise<RepositoryScanResult> {
    const rootPath = path.resolve(repositoryPath);

    await this.assertReadableDirectory(rootPath);

    const markdownFiles: RepositoryFile[] = [];
    await this.walkDirectory(rootPath, rootPath, markdownFiles);

    markdownFiles.sort((a, b) =>
      a.relativePath.localeCompare(b.relativePath, undefined, {
        sensitivity: "base",
      }),
    );

    return {
      rootPath,
      scannedAt: new Date().toISOString(),
      markdownFiles,
      ignoredDirectories: [...this.ignoredDirectories],
    };
  }

  async readMarkdownFile(
    repositoryPath: string,
    relativeFilePath: string,
  ): Promise<string> {
    const rootPath = path.resolve(repositoryPath);
    const targetPath = path.resolve(rootPath, relativeFilePath);

    this.assertPathInsideRepository(rootPath, targetPath);

    const extension = path.extname(targetPath).toLowerCase();
    if (!this.markdownExtensions.has(extension)) {
      throw new Error(`Unsupported Markdown extension: ${extension || "(none)"}`);
    }

    return fs.readFile(targetPath, "utf8");
  }

  private async walkDirectory(
    rootPath: string,
    currentPath: string,
    markdownFiles: RepositoryFile[],
  ): Promise<void> {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      if (this.ignoredDirectories.has(entry.name)) {
        continue;
      }

      const absolutePath = path.join(currentPath, entry.name);

      if (entry.isSymbolicLink()) {
        if (!this.followSymbolicLinks) {
          continue;
        }

        const targetStats = await fs.stat(absolutePath);

        if (targetStats.isDirectory()) {
          await this.walkDirectory(rootPath, absolutePath, markdownFiles);
        } else if (targetStats.isFile()) {
          await this.addMarkdownFile(rootPath, absolutePath, markdownFiles);
        }

        continue;
      }

      if (entry.isDirectory()) {
        await this.walkDirectory(rootPath, absolutePath, markdownFiles);
        continue;
      }

      if (entry.isFile()) {
        await this.addMarkdownFile(rootPath, absolutePath, markdownFiles);
      }
    }
  }

  private async addMarkdownFile(
    rootPath: string,
    absolutePath: string,
    markdownFiles: RepositoryFile[],
  ): Promise<void> {
    const extension = path.extname(absolutePath).toLowerCase();

    if (!this.markdownExtensions.has(extension)) {
      return;
    }

    const stats = await fs.stat(absolutePath);

    markdownFiles.push({
      absolutePath,
      relativePath: path.relative(rootPath, absolutePath),
      name: path.basename(absolutePath),
      extension,
      size: stats.size,
      modifiedAt: stats.mtime.toISOString(),
    });
  }

  private async assertReadableDirectory(directoryPath: string): Promise<void> {
    let stats;

    try {
      stats = await fs.stat(directoryPath);
    } catch {
      throw new Error(`Repository path does not exist: ${directoryPath}`);
    }

    if (!stats.isDirectory()) {
      throw new Error(`Repository path is not a directory: ${directoryPath}`);
    }

    try {
      await fs.access(directoryPath, fs.constants.R_OK);
    } catch {
      throw new Error(`Repository path is not readable: ${directoryPath}`);
    }
  }

  private assertPathInsideRepository(
    rootPath: string,
    targetPath: string,
  ): void {
    const relativePath = path.relative(rootPath, targetPath);

    if (
      relativePath.startsWith("..") ||
      path.isAbsolute(relativePath)
    ) {
      throw new Error("Requested file is outside the repository.");
    }
  }
}

export default RepositoryService;
