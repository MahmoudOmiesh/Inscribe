import { FONT_TYPES } from "@/text-editor/model/schema";
import { EditorNodeSchema } from "@/text-editor/model/zod";
import z from "zod";

export const NoteInsertSchema = z.object({
  folderId: z.string(),
  sortOrder: z.number().positive().int(),
  content: z.array(EditorNodeSchema),
});

export const NoteDuplicateSchema = z.object({
  originalNoteId: z.string(),
  sortOrder: z.number().positive().int(),
});

export const NoteTitleUpdateSchema = z.object({
  title: z.string(),
});

export const NoteContentUpdateSchema = z.object({
  content: z.array(EditorNodeSchema),
});

export const NoteFavoriteUpdateSchema = z.object({
  isFavorite: z.boolean(),
});

export const NoteTrashUpdateSchema = z.object({
  isTrashed: z.boolean(),
});

export const NoteArchiveUpdateSchema = z.object({
  isArchived: z.boolean(),
});

export const NoteFontUpdateSchema = z.object({
  font: z.enum(FONT_TYPES),
});

export const NoteSmallTextUpdateSchema = z.object({
  smallText: z.boolean(),
});

export const NoteLockedUpdateSchema = z.object({
  locked: z.boolean(),
});

export const NoteFullWidthUpdateSchema = z.object({
  fullWidth: z.boolean(),
});

export const NoteFolderUpdateSchema = z.object({
  folderId: z.string(),
});

export type NoteInsert = z.infer<typeof NoteInsertSchema>;
export type NoteDuplicate = z.infer<typeof NoteDuplicateSchema>;
export type NoteTitleUpdate = z.infer<typeof NoteTitleUpdateSchema>;
export type NoteContentUpdate = z.infer<typeof NoteContentUpdateSchema>;
export type NoteFavoriteUpdate = z.infer<typeof NoteFavoriteUpdateSchema>;
export type NoteTrashUpdate = z.infer<typeof NoteTrashUpdateSchema>;
export type NoteArchiveUpdate = z.infer<typeof NoteArchiveUpdateSchema>;
export type NoteFontUpdate = z.infer<typeof NoteFontUpdateSchema>;
export type NoteSmallTextUpdate = z.infer<typeof NoteSmallTextUpdateSchema>;
export type NoteLockedUpdate = z.infer<typeof NoteLockedUpdateSchema>;
export type NoteFullWidthUpdate = z.infer<typeof NoteFullWidthUpdateSchema>;
export type NoteFolderUpdate = z.infer<typeof NoteFolderUpdateSchema>;
