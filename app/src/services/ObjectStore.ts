import type {
  AtelierObjectType,
  BaseObject,
} from "../engine/models/BaseObject";

export interface ObjectStoreQuery {
  type?: AtelierObjectType;
  tag?: string;
  status?: BaseObject["status"];
  text?: string;
}

export interface ObjectStoreStats {
  total: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
}

export class ObjectStore {
  private readonly objects = new Map<string, BaseObject>();

  add(object: BaseObject): void {
    if (!object.id.trim()) {
      throw new Error("Object id must not be empty.");
    }

    this.objects.set(object.id, object);
  }

  addMany(objects: Iterable<BaseObject>): void {
    for (const object of objects) {
      this.add(object);
    }
  }

  get(id: string): BaseObject | undefined {
    return this.objects.get(id);
  }

  has(id: string): boolean {
    return this.objects.has(id);
  }

  getAll(): BaseObject[] {
    return [...this.objects.values()];
  }

  query(criteria: ObjectStoreQuery = {}): BaseObject[] {
    const normalizedText = criteria.text?.trim().toLowerCase();
    const normalizedTag = criteria.tag?.trim().toLowerCase();

    return this.getAll().filter((object) => {
      if (criteria.type && object.type !== criteria.type) {
        return false;
      }

      if (criteria.status && object.status !== criteria.status) {
        return false;
      }

      if (
        normalizedTag &&
        !object.tags.some((tag) => tag.toLowerCase() === normalizedTag)
      ) {
        return false;
      }

      if (normalizedText) {
        const searchableText = [
          object.id,
          object.title,
          object.summary ?? "",
          object.path,
          ...object.tags,
          ...object.aliases,
        ]
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(normalizedText)) {
          return false;
        }
      }

      return true;
    });
  }

  getByType(type: AtelierObjectType): BaseObject[] {
    return this.query({ type });
  }

  getRelatedTo(targetId: string): BaseObject[] {
    return this.getAll().filter((object) =>
      object.relations.some((relation) => relation.targetId === targetId),
    );
  }

  getOutgoingRelations(sourceId: string): BaseObject["relations"] {
    return this.get(sourceId)?.relations ?? [];
  }

  remove(id: string): boolean {
    return this.objects.delete(id);
  }

  clear(): void {
    this.objects.clear();
  }

  size(): number {
    return this.objects.size;
  }

  getStats(): ObjectStoreStats {
    const byType: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    for (const object of this.objects.values()) {
      byType[object.type] = (byType[object.type] ?? 0) + 1;

      if (object.status) {
        byStatus[object.status] = (byStatus[object.status] ?? 0) + 1;
      }
    }

    return {
      total: this.objects.size,
      byType,
      byStatus,
    };
  }
}

export default ObjectStore;
