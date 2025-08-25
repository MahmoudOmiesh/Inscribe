import { createParagraph } from "@/text-editor/model/nodes";
import { localDB } from "../db";
import { nanoid } from "nanoid";
import type {
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

export async function createLocalNote({
  userId,
  folderId,
}: {
  userId: string;
  folderId: string;
}) {
  const lastNote = await localDB.notes.orderBy("sortOrder").last();
  const sortOrder = (lastNote?.sortOrder ?? 0) + 1;

  const noteId = await localDB.notes.add({
    id: nanoid(),
    userId,
    folderId,
    serverId: null,

    title: "New Note",
    content: JSON.stringify([createParagraph()]),
    sortOrder,

    isArchived: false,
    isTrashed: false,
    isFavorite: false,

    font: "default",
    smallText: false,
    locked: false,
    fullWidth: false,

    createdAt: Date.now(),
    updatedAt: Date.now(),
    lastSyncedAt: null,
  });

  return noteId;
}

export async function updateLocalNoteTitle({
  noteId,
  data,
}: {
  noteId: string;
  data: NoteTitleUpdate;
}) {
  return localDB.notes.update(noteId, {
    title: data.title,
    updatedAt: Date.now(),
  });
}

export async function updateLocalNoteContent({
  noteId,
  data,
}: {
  noteId: string;
  data: NoteContentUpdate;
}) {
  return localDB.notes.update(noteId, {
    content: JSON.stringify(data.content),
    updatedAt: Date.now(),
  });
}

export async function updateLocalNoteFavorite({
  noteId,
  data,
}: {
  noteId: string;
  data: NoteFavoriteUpdate;
}) {
  return localDB.notes.update(noteId, {
    isFavorite: data.isFavorite,
    updatedAt: Date.now(),
  });
}

export async function updateLocalNoteTrash({
  noteId,
  data,
}: {
  noteId: string;
  data: NoteTrashUpdate;
}) {
  return localDB.notes.update(noteId, {
    isTrashed: data.isTrashed,
    updatedAt: Date.now(),
  });
}

export async function updateLocalNoteFont({
  noteId,
  data,
}: {
  noteId: string;
  data: NoteFontUpdate;
}) {
  return localDB.notes.update(noteId, {
    font: data.font,
    updatedAt: Date.now(),
  });
}

export async function updateLocalNoteSmallText({
  noteId,
  data,
}: {
  noteId: string;
  data: NoteSmallTextUpdate;
}) {
  return localDB.notes.update(noteId, {
    smallText: data.smallText,
    updatedAt: Date.now(),
  });
}

export async function updateLocalNoteLocked({
  noteId,
  data,
}: {
  noteId: string;
  data: NoteLockedUpdate;
}) {
  return localDB.notes.update(noteId, {
    locked: data.locked,
    updatedAt: Date.now(),
  });
}

export async function updateLocalNoteFullWidth({
  noteId,
  data,
}: {
  noteId: string;
  data: NoteFullWidthUpdate;
}) {
  return localDB.notes.update(noteId, {
    fullWidth: data.fullWidth,
    updatedAt: Date.now(),
  });
}

export async function updateLocalNoteFolder({
  noteId,
  data,
}: {
  noteId: string;
  data: NoteFolderUpdate;
}) {
  return localDB.notes.update(noteId, {
    folderId: data.folderId,
    updatedAt: Date.now(),
  });
}

export async function deleteLocalNote({ noteId }: { noteId: string }) {
  return localDB.notes.delete(noteId);
}
