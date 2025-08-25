import type { LocalFolder } from "@/lib/schema/folder";
import type { LocalNote } from "@/lib/schema/note";
import Dexie, { type Table } from "dexie";

export class LocalDB extends Dexie {
  folders!: Table<LocalFolder, string>;
  notes!: Table<LocalNote, string>;

  constructor() {
    super("local-db");
    this.version(1).stores({
      folders: "id, serverId, userId, sortOrder",
      notes: "id, serverId, folderId, sortOrder",
    });
  }

  deleteFolder(folderId: string) {
    return this.transaction("rw", this.folders, this.notes, async () => {
      void this.folders.where({ id: folderId }).delete();
      void this.notes.where({ folderId }).delete();
    });
  }
}

export const localDB = new LocalDB();
