import type {
  NoteArchiveUpdate,
  NoteContentUpdate,
  NoteDuplicate,
  NoteFavoriteUpdate,
  NoteFolderUpdate,
  NoteFontUpdate,
  NoteFullWidthUpdate,
  NoteInsert,
  NoteLockedUpdate,
  NoteSmallTextUpdate,
  NoteTitleUpdate,
  NoteTrashUpdate,
} from "@/lib/schema/note";
import { db } from "./root";
import type { Prisma } from "@prisma/client";

export const _notes = {
  queries: {
    getAllSince: async (userId: string, since: number) => {
      return db.note.findMany({
        where: { userId, updatedAt: { gt: new Date(since) } },
        orderBy: { sortOrder: "asc" },
      });
    },
  },

  mutations: {
    create: async (noteId: string, userId: string, data: NoteInsert) => {
      return db.note.create({
        data: {
          id: noteId,
          folderId: data.folderId,
          userId,
          sortOrder: data.sortOrder,
          title: "New Note",
          content: data.content as unknown as Prisma.InputJsonValue,
        },
        select: { id: true },
      });
    },

    duplicate: async (noteId: string, userId: string, data: NoteDuplicate) => {
      return db.$transaction(async (tx) => {
        const originalNote = await tx.note.findUnique({
          where: { id: data.originalNoteId, userId },
        });

        if (!originalNote) {
          throw new Error("Note not found");
        }

        await tx.note.create({
          data: {
            ...originalNote,
            id: noteId,
            title: `${originalNote.title} (Duplicate)`,
            content: originalNote.content as unknown as Prisma.InputJsonValue,
            sortOrder: data.sortOrder,
          },
        });
      });
    },

    updateTitle: (noteId: string, userId: string, data: NoteTitleUpdate) => {
      return db.note.update({
        where: { id: noteId, userId },
        data: {
          title: data.title,
        },
        select: {
          id: true,
          title: true,
        },
      });
    },

    updateContent: (
      noteId: string,
      userId: string,
      data: NoteContentUpdate,
    ) => {
      return db.note.update({
        where: { id: noteId, userId },
        data: {
          content: data.content as Prisma.InputJsonValue,
        },
        select: { id: true },
      });
    },

    updateFavorite: async (
      noteId: string,
      userId: string,
      data: NoteFavoriteUpdate,
    ) => {
      return db.note.update({
        where: { id: noteId, userId },
        data: { isFavorite: data.isFavorite },
        select: {
          id: true,
          isFavorite: true,
        },
      });
    },

    updateTrash: async (
      noteId: string,
      userId: string,
      data: NoteTrashUpdate,
    ) => {
      return db.note.update({
        where: { id: noteId, userId },
        data: { isTrashed: data.isTrashed },
        select: { id: true, isTrashed: true },
      });
    },

    updateArchive: async (
      noteId: string,
      userId: string,
      data: NoteArchiveUpdate,
    ) => {
      return db.note.update({
        where: { id: noteId, userId },
        data: { isArchived: data.isArchived },
        select: { id: true, isArchived: true },
      });
    },

    updateFont: (noteId: string, userId: string, data: NoteFontUpdate) => {
      return db.note.update({
        where: { id: noteId, userId },
        data: { font: data.font },
        select: { id: true, font: true },
      });
    },

    updateSmallText: (
      noteId: string,
      userId: string,
      data: NoteSmallTextUpdate,
    ) => {
      return db.note.update({
        where: { id: noteId, userId },
        data: { smallText: data.smallText },
        select: { id: true, smallText: true },
      });
    },

    updateLocked: (noteId: string, userId: string, data: NoteLockedUpdate) => {
      return db.note.update({
        where: { id: noteId, userId },
        data: { locked: data.locked },
        select: { id: true, locked: true },
      });
    },

    updateFullWidth: (
      noteId: string,
      userId: string,
      data: NoteFullWidthUpdate,
    ) => {
      return db.note.update({
        where: { id: noteId, userId },
        data: { fullWidth: data.fullWidth },
        select: { id: true, fullWidth: true },
      });
    },

    updateFolder: (noteId: string, userId: string, data: NoteFolderUpdate) => {
      return db.note.update({
        where: { id: noteId, userId },
        data: { folderId: data.folderId },
        select: { id: true, folderId: true },
      });
    },

    delete: (noteId: string, userId: string) => {
      return db.note.update({
        where: { id: noteId, userId, deletedAt: null },
        data: {
          deletedAt: new Date(),
        },
        select: { id: true, deletedAt: true },
      });
    },
  },
};
