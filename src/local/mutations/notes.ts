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
}

export async function deleteLocalNote({
  noteId,
  userId,
}: {
  noteId: string;
  userId: string;
}) {
  const deletedCount = await localDB.notes.delete(noteId);

  await operationQueue.add({
    userId,
    operation: {
      noteId,
      type: "deleteNote",
    },
  });

  return deletedCount;
}
