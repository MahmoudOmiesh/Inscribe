import type {
  NoteArchiveUpdate,
  NoteContentUpdate,
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
import { nanoid } from "nanoid";

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
          content: JSON.parse(data.content) as unknown as Prisma.InputJsonValue,
        },
        select: { id: true },
      });
    },

    duplicate: async (noteId: string, userId: string) => {
      const note = await db.note.findUnique({
        where: { id: noteId, userId },
        select: { title: true, content: true, folderId: true },
      });

      if (note === null) {
        throw new Error("Note not found");
      }

      const last = await db.note.findFirst({
        where: { folderId: note.folderId, userId },
        orderBy: { sortOrder: "desc" },
        select: { sortOrder: true },
      });

      const sortOrder = (last?.sortOrder ?? 0) + 1;

      return db.note.create({
        data: {
          id: nanoid(),
          title: `${note.title} (Duplicate)`,
          content: note.content as Prisma.InputJsonValue,
          sortOrder,
          folderId: note.folderId,
          userId,
        },
        select: { id: true },
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
        data: { content: data.content as Prisma.InputJsonValue },
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
