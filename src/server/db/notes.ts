import type {
  NoteContentUpdate,
  NoteFavoriteUpdate,
  NoteFolderUpdate,
  NoteFontUpdate,
  NoteFullWidthUpdate,
  NoteLockedUpdate,
  NoteSmallTextUpdate,
  NoteTitleUpdate,
} from "@/lib/schema/note";
import { db } from "./root";
import type { Prisma } from "@prisma/client";
import type { EditorNode } from "@/text-editor/model/schema";
import { nanoid } from "nanoid";

const newNoteContent: EditorNode[] = [
  {
    id: nanoid(),
    type: "paragraph",
    text: "Hello, world!",
    alignment: "left",
    marks: [],
  },
];

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

          font: true,
          smallText: true,
          fullWidth: true,
          locked: true,

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
          content: newNoteContent as unknown as Prisma.InputJsonValue,
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

    updateContent: (
      noteId: number,
      userId: string,
      data: NoteContentUpdate,
    ) => {
      return db.note.update({
        where: { id: noteId, userId },
        data: { content: data.content as Prisma.InputJsonValue },
        select: { id: true },
      });
    },

    //TODO: change this to take a boolean instead of toggling
    toggleFavorite: async (
      noteId: number,
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

    updateFont: (noteId: number, userId: string, data: NoteFontUpdate) => {
      return db.note.update({
        where: { id: noteId, userId },
        data: { font: data.font },
        select: { id: true, font: true },
      });
    },

    updateSmallText: (
      noteId: number,
      userId: string,
      data: NoteSmallTextUpdate,
    ) => {
      return db.note.update({
        where: { id: noteId, userId },
        data: { smallText: data.smallText },
        select: { id: true, smallText: true },
      });
    },

    updateLocked: (noteId: number, userId: string, data: NoteLockedUpdate) => {
      return db.note.update({
        where: { id: noteId, userId },
        data: { locked: data.locked },
        select: { id: true, locked: true },
      });
    },

    updateFullWidth: (
      noteId: number,
      userId: string,
      data: NoteFullWidthUpdate,
    ) => {
      return db.note.update({
        where: { id: noteId, userId },
        data: { fullWidth: data.fullWidth },
        select: { id: true, fullWidth: true },
      });
    },

    updateFolder: (noteId: number, userId: string, data: NoteFolderUpdate) => {
      return db.note.update({
        where: { id: noteId, userId },
        data: { folderId: data.folderId },
        select: { id: true, folderId: true },
      });
    },
  },
};
