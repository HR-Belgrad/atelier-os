const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('node:fs/promises');
const path = require('node:path');

const isDev = !app.isPackaged;

const IGNORED_DIRECTORIES = new Set([
  '.git',
  'node_modules',
  'dist',
  'build',
  'out',
  'release',
  '.cache',
  '.vite',
]);

function createWindow() {
  const window = new BrowserWindow({
    width: 1320,
    height: 860,
    minWidth: 980,
    minHeight: 680,
    backgroundColor: '#0f1012',
    title: 'Atelier',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  if (isDev) {
    window.loadURL('http://localhost:5173');
  } else {
    window.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

async function scanMarkdownFiles(rootPath) {
  const files = [];

  async function walk(currentPath) {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      if (IGNORED_DIRECTORIES.has(entry.name)) continue;

      const absolutePath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        await walk(absolutePath);
        continue;
      }

      if (!entry.isFile()) continue;

      const extension = path.extname(entry.name).toLowerCase();
      if (extension !== '.md' && extension !== '.markdown') continue;

      const stat = await fs.stat(absolutePath);
      const content = await fs.readFile(absolutePath, 'utf8');

      files.push({
        absolutePath,
        relativePath: path.relative(rootPath, absolutePath),
        name: entry.name,
        size: stat.size,
        createdAt: stat.birthtime.toISOString(),
        modifiedAt: stat.mtime.toISOString(),
        content,
      });
    }
  }

  await walk(rootPath);
  files.sort((a, b) => a.relativePath.localeCompare(b.relativePath, 'de'));
  return files;
}

function parseScalar(raw) {
  const value = raw.trim();
  if (!value) return '';

  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }

  if (value.startsWith('[') && value.endsWith(']')) {
    const inner = value.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map((part) => parseScalar(part));
  }

  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null') return null;

  const numeric = Number(value);
  if (!Number.isNaN(numeric)) return numeric;

  return value;
}

function parseSimpleFrontmatter(source) {
  const result = {};
  const lines = source.split('\n');
  let listKey = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    if (line.startsWith('- ') && listKey) {
      if (!Array.isArray(result[listKey])) result[listKey] = [];
      result[listKey].push(parseScalar(line.slice(2)));
      continue;
    }

    const separator = line.indexOf(':');
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1).trim();

    if (!rawValue) {
      result[key] = [];
      listKey = key;
    } else {
      result[key] = parseScalar(rawValue);
      listKey = null;
    }
  }

  return result;
}

function splitMarkdown(content) {
  const normalized = content.replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) return { frontmatter: {}, body: normalized };

  const end = normalized.indexOf('\n---\n', 4);
  if (end === -1) return { frontmatter: {}, body: normalized };

  return {
    frontmatter: parseSimpleFrontmatter(normalized.slice(4, end)),
    body: normalized.slice(end + 5),
  };
}

function firstHeading(body) {
  const match = body.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : undefined;
}

function titleFromPath(relativePath) {
  return path.basename(relativePath, path.extname(relativePath)).replace(/[-_]+/g, ' ').trim();
}

function stableId(type, relativePath) {
  const normalized = relativePath
    .replace(/\\/g, '/')
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9äöüß/]+/g, '-')
    .replace(/\//g, ':')
    .replace(/^-+|-+$/g, '');

  return `${type}:${normalized || 'untitled'}`;
}

function extractWikiLinks(content) {
  const links = new Set();
  const pattern = /\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g;
  for (const match of content.matchAll(pattern)) {
    const value = match[1] && match[1].trim();
    if (value) links.add(value);
  }
  return [...links];
}

function normalizeStringArray(value) {
  if (Array.isArray(value)) return value.map(String).map((v) => v.trim()).filter(Boolean);
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
}

function parseObject(file) {
  const { frontmatter, body } = splitMarkdown(file.content);
  const type = typeof frontmatter.type === 'string' ? frontmatter.type.toLowerCase() : 'unknown';
  const title =
    (typeof frontmatter.title === 'string' && frontmatter.title.trim()) ||
    firstHeading(body) ||
    titleFromPath(file.relativePath);

  return {
    id:
      (typeof frontmatter.id === 'string' && frontmatter.id.trim()) ||
      stableId(type, file.relativePath),
    type,
    title,
    path: file.relativePath,
    status: typeof frontmatter.status === 'string' ? frontmatter.status.toLowerCase() : undefined,
    summary:
      (typeof frontmatter.summary === 'string' && frontmatter.summary) ||
      (typeof frontmatter.description === 'string' && frontmatter.description) ||
      undefined,
    tags: normalizeStringArray(frontmatter.tags),
    aliases: normalizeStringArray(frontmatter.aliases),
    links: extractWikiLinks(file.content),
    relations: [],
    createdAt:
      (typeof frontmatter.createdAt === 'string' && frontmatter.createdAt) || file.createdAt,
    modifiedAt:
      (typeof frontmatter.modifiedAt === 'string' && frontmatter.modifiedAt) || file.modifiedAt,
    metadata: frontmatter,
  };
}

ipcMain.handle('repository:open', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Atelier-Repository auswählen',
    properties: ['openDirectory'],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true };
  }

  const rootPath = result.filePaths[0];
  const files = await scanMarkdownFiles(rootPath);
  const objects = files.map(parseObject);

  return {
    canceled: false,
    rootPath,
    repositoryName: path.basename(rootPath),
    scannedAt: new Date().toISOString(),
    filesFound: files.length,
    objects,
  };
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
