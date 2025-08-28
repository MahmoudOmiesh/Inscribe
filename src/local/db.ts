import type { LocalFolder } from "@/local/schema/folder";
import type { LocalNote } from "@/local/schema/note";
import Dexie, { type Table } from "dexie";
import type { SyncOperation } from "./schema/sync";

export class LocalDB extends Dexie {
  folders!: Table<LocalFolder, string>;
  notes!: Table<LocalNote, string>;
  syncOperations!: Table<SyncOperation, string>;

  constructor() {
    super("local-db");
    this.version(1).stores({
      folders: "id, userId, [userId+sortOrder]",
      notes:
        "id, userId, folderId, [folderId+sortOrder], [userId+isFavorite+isTrashed+isArchived+createdAt], [userId+isArchived+isTrashed+createdAt], [userId+isTrashed+createdAt]",
      syncOperations: "id, userId, timestamp, [userId+status+timestamp]",
    });
  }

  deleteFolder(folderId: string) {
    return this.transaction("rw", this.folders, this.notes, async () => {
      const deletedFolderCount = await this.folders
        .where({ id: folderId })
        .delete();
      const deletedNoteCount = await this.notes.where({ folderId }).delete();
      return { deletedFolderCount, deletedNoteCount };
    });
  }
}

export const localDB = new LocalDB();
