import type { NoteTitleUpdate } from "@/lib/schema/note";
import { db } from "./root";
import type { Prisma } from "@prisma/client";

export const _notes = {
  queries: {
    get: (noteId: number, userId: string) => {
      return db.note.findUnique({
        where: { id: noteId, userId },
        select: {
          id: true,
          title: true,
          content: true,
          isFavorite: true,
          isArchived: true,
          isTrashed: true,

          folderId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    },
  },

  mutations: {
    create: async (folderId: number, userId: string) => {
      const last = await db.note.findFirst({
        where: { folderId, userId },
        orderBy: { sortOrder: "desc" },
        select: { sortOrder: true },
      });

      const sortOrder = (last?.sortOrder ?? 0) + 1;

      return db.note.create({
        data: {
          folderId,
          userId,
          sortOrder,
          title: "New Note",
          content: "",
        },
        select: { id: true },
      });
    },

    duplicate: async (noteId: number, userId: string) => {
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
          title: `${note.title} (Duplicate)`,
          content: note.content as Prisma.InputJsonValue,
          sortOrder,
          folderId: note.folderId,
          userId,
        },
        select: { id: true },
      });
    },

    updateTitle: (noteId: number, userId: string, data: NoteTitleUpdate) => {
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

    toggleFavorite: async (noteId: number, userId: string) => {
      const note = await db.note.findUnique({
        where: { id: noteId, userId },
        select: { isFavorite: true },
      });

      if (note === null) {
        throw new Error("Note not found");
      }

      return db.note.update({
        where: { id: noteId, userId },
        data: { isFavorite: !note.isFavorite },
        select: {
          id: true,
          isFavorite: true,
        },
      });
    },
  },
};
