import path from "node:path";

import type {
  AtelierObjectStatus,
  AtelierObjectType,
  AtelierRelation,
  BaseObject,
} from "../models/BaseObject";
import { isRelationType } from "../ontology/RelationType";

export interface MarkdownParseInput {
  content: string;
  relativePath: string;
  modifiedAt?: string;
  createdAt?: string;
}

export interface MarkdownParseResult {
  object: BaseObject;
  body: string;
  frontmatter: Record<string, unknown>;
}

const KNOWN_TYPES = new Set<AtelierObjectType>([
  "work",
  "scene",
  "chapter",
  "song",
  "album",
  "lyric",
  "figure",
  "motif",
  "sound",
  "synth",
  "effect",
  "knowledge",
  "decision",
  "idea",
  "location",
  "tool",
  "reference",
  "unknown",
]);

const KNOWN_STATUSES = new Set<AtelierObjectStatus>([
  "idea",
  "draft",
  "active",
  "paused",
  "archived",
  "canonical",
  "published",
]);

export class MarkdownParser {
  parse(input: MarkdownParseInput): MarkdownParseResult {
    const { frontmatter, body } = this.splitDocument(input.content);

    const title =
      this.readString(frontmatter.title) ??
      this.readFirstHeading(body) ??
      this.titleFromPath(input.relativePath);

    const type = this.parseType(frontmatter.type);
    const status = this.parseStatus(frontmatter.status);

    const links = this.extractWikiLinks(input.content);
    const relations = this.parseRelations(frontmatter.relations);

    const object: BaseObject = {
      id:
        this.readString(frontmatter.id) ??
        this.createStableId(type, input.relativePath),
      type,
      title,
      path: input.relativePath,
      status,
      summary:
        this.readString(frontmatter.summary) ??
        this.readString(frontmatter.description),
      tags: this.readStringArray(frontmatter.tags),
      aliases: this.readStringArray(frontmatter.aliases),
      links,
      relations,
      createdAt:
        this.readString(frontmatter.createdAt) ??
        this.readString(frontmatter.created_at) ??
        input.createdAt,
      modifiedAt:
        this.readString(frontmatter.modifiedAt) ??
        this.readString(frontmatter.modified_at) ??
        input.modifiedAt,
      metadata: frontmatter,
    };

    return {
      object,
      body,
      frontmatter,
    };
  }

  private splitDocument(content: string): {
    frontmatter: Record<string, unknown>;
    body: string;
  } {
    const normalized = content.replace(/\r\n/g, "\n");

    if (!normalized.startsWith("---\n")) {
      return {
        frontmatter: {},
        body: normalized,
      };
    }

    const closingMarkerIndex = normalized.indexOf("\n---\n", 4);

    if (closingMarkerIndex === -1) {
      return {
        frontmatter: {},
        body: normalized,
      };
    }

    const rawFrontmatter = normalized.slice(4, closingMarkerIndex);
    const body = normalized.slice(closingMarkerIndex + 5);

    return {
      frontmatter: this.parseSimpleYaml(rawFrontmatter),
      body,
    };
  }

  /**
   * Kleine YAML-Teilmenge für Atelier-Metadaten:
   * - key: value
   * - Arrays als [a, b]
   * - Listen mit "- item"
   * - verschachtelte Relationsobjekte
   *
   * Später kann eine vollständige YAML-Bibliothek eingesetzt werden,
   * ohne die öffentliche parse()-Methode zu verändern.
   */
  private parseSimpleYaml(source: string): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    const lines = source.split("\n");

    let currentKey: string | null = null;
    let currentList: unknown[] | null = null;
    let currentObject: Record<string, unknown> | null = null;

    for (const rawLine of lines) {
      if (!rawLine.trim() || rawLine.trimStart().startsWith("#")) {
        continue;
      }

      const indentation = rawLine.length - rawLine.trimStart().length;
      const line = rawLine.trim();

      if (line.startsWith("- ")) {
        if (!currentKey || !currentList) {
          continue;
        }

        const itemSource = line.slice(2).trim();

        if (itemSource.includes(":")) {
          const [key, ...rest] = itemSource.split(":");

          currentObject = {
            [key.trim()]: this.parseScalar(rest.join(":").trim()),
          };

          currentList.push(currentObject);
        } else {
          currentList.push(this.parseScalar(itemSource));
          currentObject = null;
        }

        continue;
      }

      if (indentation > 0 && currentObject && line.includes(":")) {
        const [key, ...rest] = line.split(":");

        currentObject[key.trim()] = this.parseScalar(
          rest.join(":").trim(),
        );

        continue;
      }

      const separatorIndex = line.indexOf(":");

      if (separatorIndex === -1) {
        continue;
      }

      const key = line.slice(0, separatorIndex).trim();
      const rawValue = line.slice(separatorIndex + 1).trim();

      currentKey = key;
      currentObject = null;

      if (!rawValue) {
        currentList = [];
        result[key] = currentList;
        continue;
      }

      currentList = null;
      result[key] = this.parseScalar(rawValue);
    }

    return result;
  }

  private parseScalar(value: string): unknown {
    const trimmed = value.trim();

    if (!trimmed) {
      return "";
    }

    if (
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ) {
      return trimmed.slice(1, -1);
    }

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      const inner = trimmed.slice(1, -1).trim();

      if (!inner) {
        return [];
      }

      return inner
        .split(",")
        .map((item) => this.parseScalar(item.trim()));
    }

    if (trimmed === "true") {
      return true;
    }

    if (trimmed === "false") {
      return false;
    }

    if (trimmed === "null") {
      return null;
    }

    const numericValue = Number(trimmed);

    if (!Number.isNaN(numericValue) && trimmed !== "") {
      return numericValue;
    }

    return trimmed;
  }

  private parseType(value: unknown): AtelierObjectType {
    const normalized = this.readString(value)?.toLowerCase();

    if (normalized && KNOWN_TYPES.has(normalized as AtelierObjectType)) {
      return normalized as AtelierObjectType;
    }

    return "unknown";
  }

  private parseStatus(
    value: unknown,
  ): AtelierObjectStatus | undefined {
    const normalized = this.readString(value)?.toLowerCase();

    if (
      normalized &&
      KNOWN_STATUSES.has(normalized as AtelierObjectStatus)
    ) {
      return normalized as AtelierObjectStatus;
    }

    return undefined;
  }

  private parseRelations(value: unknown): AtelierRelation[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.flatMap((item): AtelierRelation[] => {
      if (typeof item === "string") {
        return [
          {
            type: "related-to",
            targetId: item,
          },
        ];
      }

      if (typeof item !== "object" || item === null) {
        return [];
      }

      const relation = item as Record<string, unknown>;

      const type = this.readString(relation.type);

      const targetId =
        this.readString(relation.targetId) ??
        this.readString(relation.target) ??
        this.readString(relation.id);

      const label = this.readString(relation.label);

      if (!type || !targetId) {
        return [];
      }

      if (!isRelationType(type)) {
        return [];
      }

      return [
        {
          type,
          targetId,
          label,
        },
      ];
    });
  }

  private extractWikiLinks(content: string): string[] {
    const links = new Set<string>();
    const pattern =
      /\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g;

    for (const match of content.matchAll(pattern)) {
      const target = match[1]?.trim();

      if (target) {
        links.add(target);
      }
    }

    return [...links];
  }

  private readFirstHeading(body: string): string | undefined {
    const match = body.match(/^#\s+(.+)$/m);
    return match?.[1]?.trim();
  }

  private titleFromPath(relativePath: string): string {
    const filename = path.basename(
      relativePath,
      path.extname(relativePath),
    );

    return filename
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  private readString(value: unknown): string | undefined {
    if (typeof value !== "string") {
      return undefined;
    }

    const trimmed = value.trim();
    return trimmed || undefined;
  }

  private readStringArray(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value.flatMap((item) => {
        if (typeof item !== "string") {
          return [];
        }

        const trimmed = item.trim();
        return trimmed ? [trimmed] : [];
      });
    }

    const singleValue = this.readString(value);
    return singleValue ? [singleValue] : [];
  }

  private createStableId(
    type: AtelierObjectType,
    relativePath: string,
  ): string {
    const normalizedPath = relativePath
      .replace(/\\/g, "/")
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9äöüß/]+/g, "-")
      .replace(/\//g, ":")
      .replace(/^-+|-+$/g, "");

    return `${type}:${normalizedPath || "untitled"}`;
  }
}

export default MarkdownParser;