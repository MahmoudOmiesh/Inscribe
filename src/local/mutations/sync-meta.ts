import type { RouterOutputs } from "@/trpc/react";
import { localDB } from "../db";

export function setLastPulledAt(userId: string, lastPulledAt: number) {
  return localDB.syncMeta.put({
    userId,
    lastPulledAt,
  });
}

export async function updateFoldersFromPull(
  folders: RouterOutputs["sync"]["pull"]["folders"],
) {
  const toDelete = folders.filter((folder) => folder.deletedAt != null);
  const toUpsert = folders.filter((folder) => folder.deletedAt == null);

  return Promise.all([
    localDB.deleteFolders(toDelete.map((folder) => folder.id)),
    localDB.folders.bulkPut(
      toUpsert.map(({ deletedAt: _, ...folder }) => ({
        ...folder,
        createdAt: folder.createdAt.getTime(),
        updatedAt: folder.updatedAt.getTime(),
      })),
    ),
  ]);
}

export async function updateNotesFromPull(
  notes: RouterOutputs["sync"]["pull"]["notes"],
) {
  const toDelete = notes.filter((note) => note.deletedAt != null);
  const toUpsert = notes.filter((note) => note.deletedAt == null);

  return Promise.all([
    await localDB.notes.bulkDelete(toDelete.map((note) => note.id)),
    await localDB.notes.bulkPut(
      toUpsert.map(({ deletedAt: _, ...note }) => ({
        ...note,
        content: JSON.stringify(note.content),
        isArchived: note.isArchived ? 1 : 0,
        isTrashed: note.isTrashed ? 1 : 0,
        isFavorite: note.isFavorite ? 1 : 0,
        createdAt: note.createdAt.getTime(),
        updatedAt: note.updatedAt.getTime(),
      })),
    ),
  ]);
}
