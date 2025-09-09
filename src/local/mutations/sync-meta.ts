import type { RouterOutputs } from "@/trpc/react";
import { localDB } from "../db";
import type { NoteSyncOperation } from "../schema/sync";
import type { LocalNote } from "../schema/note";
import { operationQueue } from "@/sync/operation-queue";
import type { EditorNode } from "@/text-editor/model/schema";

export function setLastPulledAt(userId: string, lastPulledAt: number) {
  return localDB.syncMeta.put({
    userId,
    lastPulledAt,
  });
}

// TODO: should do the same thing I did in notes here too
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
  userId: string,
) {
  const toDelete = notes.filter((note) => note.deletedAt != null);
  const toUpsert = notes.filter((note) => note.deletedAt == null);

  const updatedNotes = await getNotesToUpdate(toUpsert, userId);

  return Promise.all([
    localDB.notes.bulkDelete(toDelete.map((note) => note.id)),
    localDB.notes.bulkPut(
      updatedNotes.filter((note) => note !== null) as LocalNote[],
    ),
  ]);
}

async function getNotesToUpdate(
  toUpsert: RouterOutputs["sync"]["pull"]["notes"],
  userId: string,
) {
  const pendingOperations = await operationQueue.getPendingOperations(userId);
  const pendingNoteIds = new Set<string>(
    pendingOperations
      .filter((op) => "noteId" in op.operation)
      .map((op) => (op.operation as NoteSyncOperation).noteId),
  );

  return await Promise.all(
    toUpsert.map(async ({ deletedAt: _, ...serverNote }) => {
      const localNoteHasPendingOps = pendingNoteIds.has(serverNote.id);
      const localNote = await localDB.notes.get(serverNote.id);

      if (localNoteHasPendingOps && localNote == null) {
        // if the note has pending operations but doesn't exist locally
        // that means the note was deleted
        return null;
      }

      if (!localNoteHasPendingOps || localNote == null) {
        return {
          ...serverNote,
          content: serverNote.content as unknown as EditorNode[],
          isArchived: serverNote.isArchived ? 1 : 0,
          isTrashed: serverNote.isTrashed ? 1 : 0,
          isFavorite: serverNote.isFavorite ? 1 : 0,
          createdAt: serverNote.createdAt.getTime(),
          updatedAt: serverNote.updatedAt.getTime(),
        };
      }

      const pendingNoteOperations = pendingOperations.filter(
        (op) => (op.operation as NoteSyncOperation).noteId === serverNote.id,
      );

      const fieldsWithPendingOperations = new Set<keyof LocalNote>(
        pendingNoteOperations
          .map((op) => {
            switch (op.operation.type as NoteSyncOperation["type"]) {
              case "updateNoteTitle":
                return "title";
              case "updateNoteContent":
                return "content";
              case "updateNoteFavorite":
                return "isFavorite";
              case "updateNoteArchive":
                return "isArchived";
              case "updateNoteTrash":
                return "isTrashed";
              case "updateNoteFont":
                return "font";
              case "updateNoteSmallText":
                return "smallText";
              case "updateNoteLocked":
                return "locked";
              case "updateNoteFullWidth":
                return "fullWidth";
              case "updateNoteFolder":
                return "folderId";
              default:
                return null;
            }
          })
          .filter((field) => field !== null),
      );

      const mergedNote = {
        ...serverNote,
        title: fieldsWithPendingOperations.has("title")
          ? localNote.title
          : serverNote.title,
        content: fieldsWithPendingOperations.has("content")
          ? localNote.content
          : (serverNote.content as unknown as EditorNode[]),
        isArchived: fieldsWithPendingOperations.has("isArchived")
          ? localNote.isArchived
          : serverNote.isArchived
            ? 1
            : 0,
        isTrashed: fieldsWithPendingOperations.has("isTrashed")
          ? localNote.isTrashed
          : serverNote.isTrashed
            ? 1
            : 0,
        isFavorite: fieldsWithPendingOperations.has("isFavorite")
          ? localNote.isFavorite
          : serverNote.isFavorite
            ? 1
            : 0,
        font: fieldsWithPendingOperations.has("font")
          ? localNote.font
          : serverNote.font,
        smallText: fieldsWithPendingOperations.has("smallText")
          ? localNote.smallText
          : serverNote.smallText,
        locked: fieldsWithPendingOperations.has("locked")
          ? localNote.locked
          : serverNote.locked,
        fullWidth: fieldsWithPendingOperations.has("fullWidth")
          ? localNote.fullWidth
          : serverNote.fullWidth,
        folderId: fieldsWithPendingOperations.has("folderId")
          ? localNote.folderId
          : serverNote.folderId,
        createdAt: serverNote.createdAt.getTime(),
        updatedAt: Math.max(
          localNote.updatedAt,
          serverNote.updatedAt.getTime(),
        ),
      };

      return mergedNote;
    }),
  );
}
