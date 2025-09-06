import { z } from "zod";
import { FolderInsertSchema, FolderOrderSchema } from "./folder";
import {
  NoteArchiveUpdateSchema,
  NoteContentUpdateSchema,
  NoteDuplicateSchema,
  NoteFavoriteUpdateSchema,
  NoteFolderUpdateSchema,
  NoteFontUpdateSchema,
  NoteFullWidthUpdateSchema,
  NoteInsertSchema,
  NoteLockedUpdateSchema,
  NoteSmallTextUpdateSchema,
  NoteTitleUpdateSchema,
  NoteTrashUpdateSchema,
} from "./note";

export const folderSyncOperationSchema = z.discriminatedUnion("type", [
  z.object({
    folderId: z.string(),
    type: z.literal("createFolder"),
    data: FolderInsertSchema.extend({
      sortOrder: z.number(),
    }),
  }),
  z.object({
    folderId: z.string(),
    type: z.literal("updateFolder"),
    data: FolderInsertSchema,
  }),
  z.object({
    type: z.literal("reorderFolders"),
    data: FolderOrderSchema,
  }),
  z.object({
    folderId: z.string(),
    type: z.literal("deleteFolder"),
  }),
]);

export const noteSyncOperationSchema = z.discriminatedUnion("type", [
  z.object({
    noteId: z.string(),
    type: z.literal("createNote"),
    data: NoteInsertSchema,
  }),
  z.object({
    noteId: z.string(),
    type: z.literal("duplicateNote"),
    data: NoteDuplicateSchema,
  }),
  z.object({
    noteId: z.string(),
    type: z.literal("updateNoteTitle"),
    data: NoteTitleUpdateSchema,
  }),
  z.object({
    noteId: z.string(),
    type: z.literal("updateNoteContent"),
    data: NoteContentUpdateSchema,
  }),
  z.object({
    noteId: z.string(),
    type: z.literal("updateNoteFavorite"),
    data: NoteFavoriteUpdateSchema,
  }),
  z.object({
    noteId: z.string(),
    type: z.literal("updateNoteArchive"),
    data: NoteArchiveUpdateSchema,
  }),
  z.object({
    noteId: z.string(),
    type: z.literal("updateNoteTrash"),
    data: NoteTrashUpdateSchema,
  }),
  z.object({
    noteId: z.string(),
    type: z.literal("updateNoteFont"),
    data: NoteFontUpdateSchema,
  }),
  z.object({
    noteId: z.string(),
    type: z.literal("updateNoteSmallText"),
    data: NoteSmallTextUpdateSchema,
  }),
  z.object({
    noteId: z.string(),
    type: z.literal("updateNoteLocked"),
    data: NoteLockedUpdateSchema,
  }),
  z.object({
    noteId: z.string(),
    type: z.literal("updateNoteFullWidth"),
    data: NoteFullWidthUpdateSchema,
  }),
  z.object({
    noteId: z.string(),
    type: z.literal("updateNoteFolder"),
    data: NoteFolderUpdateSchema,
  }),
  z.object({
    noteId: z.string(),
    type: z.literal("deleteNote"),
  }),
]);

export const syncOperationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  timestamp: z.number(),
  status: z.enum(["pending", "success", "error"]),
  operation: z.union([folderSyncOperationSchema, noteSyncOperationSchema]),
});
