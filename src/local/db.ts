import type { LocalFolder } from "@/lib/schema/folder";
import type { LocalNote } from "@/lib/schema/note";
import Dexie, { type Table } from "dexie";

export class LocalDB extends Dexie {
  folders!: Table<LocalFolder, string>;
  notes!: Table<LocalNote, string>;

  constructor() {
    super("local-db");
    this.version(1).stores({
      folders: "id, serverId, userId, [userId+sortOrder]",
      notes:
        "id, serverId, userId, folderId, [folderId+sortOrder], [userId+isFavorite+isTrashed+isArchived+createdAt], [userId+isArchived+isTrashed+createdAt], [userId+isTrashed+createdAt]",
    });
  }

  deleteFolder(folderId: string) {
    return this.transaction("rw", this.folders, this.notes, async () => {
      await this.folders.where({ id: folderId }).delete();
      await this.notes.where({ folderId }).delete();
    });
  }
}

export const localDB = new LocalDB();
