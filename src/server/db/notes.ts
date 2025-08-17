import type { NoteTitleUpdate } from "@/lib/schema/note";
import { db } from "./root";

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
  },
};
