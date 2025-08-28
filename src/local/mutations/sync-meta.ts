import type { RouterOutputs } from "@/trpc/react";
import { localDB } from "../db";

export function setLastPulledAt(userId: string, lastPulledAt: number) {
  return localDB.syncMeta.put({
    userId,
    lastPulledAt,
  });
}

export function updateFoldersFromPull(
  folders: RouterOutputs["sync"]["pull"]["folders"],
) {
  return localDB.folders.bulkPut(
    folders.map((folder) => ({
      ...folder,
      createdAt: folder.createdAt.getTime(),
      updatedAt: folder.updatedAt.getTime(),
    })),
  );
}

export function updateNotesFromPull(
  notes: RouterOutputs["sync"]["pull"]["notes"],
) {
  return localDB.notes.bulkPut(
    notes.map((note) => ({
      ...note,
      content: JSON.stringify(note.content),
      isArchived: note.isArchived ? 1 : 0,
      isTrashed: note.isTrashed ? 1 : 0,
      isFavorite: note.isFavorite ? 1 : 0,
      createdAt: note.createdAt.getTime(),
      updatedAt: note.updatedAt.getTime(),
    })),
  );
}
