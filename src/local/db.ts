import type { LocalFolder } from "@/local/schema/folder";
import type { LocalNote } from "@/local/schema/note";
import Dexie, { type Table } from "dexie";
import type { SyncOperation } from "./schema/sync";
import type { SyncMeta } from "./schema/sync-meta";
import { getDistinctWordsFromText } from "@/lib/utils";

export class LocalDB extends Dexie {
  folders!: Table<LocalFolder, string>;
  notes!: Table<LocalNote, string>;
  syncOperations!: Table<SyncOperation, string>;
  syncMeta!: Table<SyncMeta, string>;

  constructor() {
    super("local-db");
    this.version(1).stores({
      folders: "id, userId, [userId+sortOrder]",
      notes:
        "id, userId, folderId, *searchWords, [folderId+sortOrder], [userId+isFavorite+isTrashed+isArchived+createdAt], [userId+isArchived+isTrashed+createdAt], [userId+isTrashed+createdAt]",
      syncOperations: "id, [userId+status+timestamp]",
      syncMeta: "userId",
    });
  }

  deleteFolders(folderIds: string[]) {
    return this.transaction("rw", this.folders, this.notes, async () => {
      const deletedFolderCount = await this.folders.bulkDelete(folderIds);
      const deleteNotePromises = folderIds.map((folderId) =>
        this.notes.where({ folderId }).delete(),
      );
      const deletedNoteCount = (await Promise.all(deleteNotePromises)).reduce(
        (acc, count) => acc + count,
        0,
      );
      return { deletedFolderCount, deletedNoteCount };
    });
  }
}

export const localDB = new LocalDB();

localDB.notes.hook("creating", (_, note) => {
  const text = `${note.title} ${note.content.map((c) => c.text).join(" ")}`;
  note.searchWords = getDistinctWordsFromText(text);
});

localDB.notes.hook("updating", (mods, _, note) => {
  if (!mods.hasOwnProperty("content") && !mods.hasOwnProperty("title")) {
    return;
  }

  const text = `${note.title} ${note.content.map((c) => c.text).join(" ")}`;
  return {
    searchWords: getDistinctWordsFromText(text),
  };
});

export function resetLocalDB() {
  console.log("resetLocalDB");
  return localDB.transaction(
    "rw",
    [localDB.folders, localDB.notes, localDB.syncOperations, localDB.syncMeta],
    async () => {
      await Promise.all(localDB.tables.map((table) => table.clear()));
    },
  );
}
