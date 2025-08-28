import { createParagraph } from "@/text-editor/model/nodes";
import { localDB } from "../db";
import { nanoid } from "nanoid";
import type {
  NoteArchiveUpdate,
  NoteContentUpdate,
  NoteFavoriteUpdate,
  NoteFolderUpdate,
  NoteFontUpdate,
  NoteFullWidthUpdate,
  NoteLockedUpdate,
  NoteSmallTextUpdate,
  NoteTitleUpdate,
  NoteTrashUpdate,
} from "@/lib/schema/note";
import Dexie from "dexie";
import { operationQueue } from "@/sync/operation-queue";

export async function createLocalNote({
  userId,
  folderId,
}: {
  userId: string;
  folderId: string;
}) {
  const lastNote = await localDB.notes
    .where("[folderId+sortOrder]")
    .between([folderId, Dexie.minKey], [folderId, Dexie.maxKey])
    .last();

  const sortOrder = (lastNote?.sortOrder ?? 0) + 1;
  const content = JSON.stringify([createParagraph()]);

  const tx = await localDB.transaction(
    "rw",
    [localDB.notes, localDB.syncOperations],
    async () => {
      const noteId = await localDB.notes.add({
        id: nanoid(),
        userId,
        folderId,

        title: "New Note",
        content,
        sortOrder,

        isArchived: 0,
        isTrashed: 0,
        isFavorite: 0,

        font: "default",
        smallText: false,
        locked: false,
        fullWidth: false,

        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      await operationQueue.add({
        userId,
        operation: {
          noteId,
          type: "createNote",
          data: {
            folderId,
            sortOrder,
            content,
          },
        },
      });

      return noteId;
    },
  );

  return tx;
}

export async function updateLocalNoteTitle({
  noteId,
  userId,
  data,
}: {
  noteId: string;
  userId: string;
  data: NoteTitleUpdate;
}) {
  const tx = await localDB.transaction(
    "rw",
    [localDB.notes, localDB.syncOperations],
    async () => {
      const updatedNoteCount = await localDB.notes.update(noteId, {
        title: data.title,
        updatedAt: Date.now(),
      });

      await operationQueue.add({
        userId,
        operation: {
          noteId,
          type: "updateNoteTitle",
          data,
        },
      });

      return updatedNoteCount;
    },
  );

  return tx;
}

export async function updateLocalNoteContent({
  noteId,
  userId,
  data,
}: {
  noteId: string;
  userId: string;
  data: NoteContentUpdate;
}) {
  const tx = await localDB.transaction(
    "rw",
    [localDB.notes, localDB.syncOperations],
    async () => {
      const updatedNoteCount = await localDB.notes.update(noteId, {
        content: JSON.stringify(data.content),
        updatedAt: Date.now(),
      });

      await operationQueue.add({
        userId,
        operation: {
          noteId,
          type: "updateNoteContent",
          data,
        },
      });

      return updatedNoteCount;
    },
  );

  return tx;
}

export async function updateLocalNoteFavorite({
  noteId,
  userId,
  data,
}: {
  noteId: string;
  userId: string;
  data: NoteFavoriteUpdate;
}) {
  const tx = await localDB.transaction(
    "rw",
    [localDB.notes, localDB.syncOperations],
    async () => {
      const updatedNoteCount = await localDB.notes.update(noteId, {
        isFavorite: data.isFavorite ? 1 : 0,
        updatedAt: Date.now(),
      });

      await operationQueue.add({
        userId,
        operation: {
          noteId,
          type: "updateNoteFavorite",
          data,
        },
      });

      return updatedNoteCount;
    },
  );

  return tx;
}

export async function updateLocalNoteArchive({
  noteId,
  userId,
  data,
}: {
  noteId: string;
  userId: string;
  data: NoteArchiveUpdate;
}) {
  const tx = await localDB.transaction(
    "rw",
    [localDB.notes, localDB.syncOperations],
    async () => {
      const updatedNoteCount = await localDB.notes.update(noteId, {
        isArchived: data.isArchived ? 1 : 0,
        updatedAt: Date.now(),
      });

      await operationQueue.add({
        userId,
        operation: {
          noteId,
          type: "updateNoteArchive",
          data,
        },
      });

      return updatedNoteCount;
    },
  );

  return tx;
}

export async function updateLocalNoteTrash({
  noteId,
  userId,
  data,
}: {
  noteId: string;
  userId: string;
  data: NoteTrashUpdate;
}) {
  const tx = await localDB.transaction(
    "rw",
    [localDB.notes, localDB.syncOperations],
    async () => {
      const updatedNoteCount = await localDB.notes.update(noteId, {
        isTrashed: data.isTrashed ? 1 : 0,
        updatedAt: Date.now(),
      });

      await operationQueue.add({
        userId,
        operation: {
          noteId,
          type: "updateNoteTrash",
          data,
        },
      });

      return updatedNoteCount;
    },
  );

  return tx;
}

export async function updateLocalNoteFont({
  noteId,
  userId,
  data,
}: {
  noteId: string;
  userId: string;
  data: NoteFontUpdate;
}) {
  const tx = await localDB.transaction(
    "rw",
    [localDB.notes, localDB.syncOperations],
    async () => {
      const updatedNoteCount = await localDB.notes.update(noteId, {
        font: data.font,
        updatedAt: Date.now(),
      });

      await operationQueue.add({
        userId,
        operation: {
          noteId,
          type: "updateNoteFont",
          data,
        },
      });

      return updatedNoteCount;
    },
  );

  return tx;
}

export async function updateLocalNoteSmallText({
  noteId,
  userId,
  data,
}: {
  noteId: string;
  userId: string;
  data: NoteSmallTextUpdate;
}) {
  const tx = await localDB.transaction(
    "rw",
    [localDB.notes, localDB.syncOperations],
    async () => {
      const updatedNoteCount = await localDB.notes.update(noteId, {
        smallText: data.smallText,
        updatedAt: Date.now(),
      });

      await operationQueue.add({
        userId,
        operation: {
          noteId,
          type: "updateNoteSmallText",
          data,
        },
      });

      return updatedNoteCount;
    },
  );

  return tx;
}

export async function updateLocalNoteLocked({
  noteId,
  userId,
  data,
}: {
  noteId: string;
  userId: string;
  data: NoteLockedUpdate;
}) {
  const tx = await localDB.transaction(
    "rw",
    [localDB.notes, localDB.syncOperations],
    async () => {
      const updatedNoteCount = await localDB.notes.update(noteId, {
        locked: data.locked,
        updatedAt: Date.now(),
      });

      await operationQueue.add({
        userId,
        operation: {
          noteId,
          type: "updateNoteLocked",
          data,
        },
      });

      return updatedNoteCount;
    },
  );

  return tx;
}

export async function updateLocalNoteFullWidth({
  noteId,
  userId,
  data,
}: {
  noteId: string;
  userId: string;
  data: NoteFullWidthUpdate;
}) {
  const tx = await localDB.transaction(
    "rw",
    [localDB.notes, localDB.syncOperations],
    async () => {
      const updatedNoteCount = await localDB.notes.update(noteId, {
        fullWidth: data.fullWidth,
        updatedAt: Date.now(),
      });

      await operationQueue.add({
        userId,
        operation: {
          noteId,
          type: "updateNoteFullWidth",
          data,
        },
      });

      return updatedNoteCount;
    },
  );

  return tx;
}

export async function updateLocalNoteFolder({
  noteId,
  userId,
  data,
}: {
  noteId: string;
  userId: string;
  data: NoteFolderUpdate;
}) {
  const tx = await localDB.transaction(
    "rw",
    [localDB.notes, localDB.syncOperations],
    async () => {
      const updatedNoteCount = await localDB.notes.update(noteId, {
        folderId: data.folderId,
        updatedAt: Date.now(),
      });

      await operationQueue.add({
        userId,
        operation: {
          noteId,
          type: "updateNoteFolder",
          data,
        },
      });

      return updatedNoteCount;
    },
  );

  return tx;
}

export async function deleteLocalNote({
  noteId,
  userId,
}: {
  noteId: string;
  userId: string;
}) {
  const tx = await localDB.transaction(
    "rw",
    [localDB.notes, localDB.syncOperations],
    async () => {
      const deletedCount = await localDB.notes.delete(noteId);

      await operationQueue.add({
        userId,
        operation: {
          noteId,
          type: "deleteNote",
        },
      });

      return deletedCount;
    },
  );

  return tx;
}
