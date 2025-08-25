import { FONT_TYPES, type FontType } from "@/text-editor/model/schema";
import { EditorNodeSchema } from "@/text-editor/model/zod";
import type { RouterOutputs } from "@/trpc/react";
import z from "zod";

export interface LocalNote {
  id: string;
  userId: string;
  serverId: string | null;

  title: string;
  content: string;

  sortOrder: number;

  isArchived: boolean;
  isTrashed: boolean;
  isFavorite: boolean;

  font: FontType;
  smallText: boolean;
  locked: boolean;
  fullWidth: boolean;

  createdAt: number;
  updatedAt: number;

  folderId: string;

  lastSyncedAt: number | null;
}

export const noteTitleUpdateSchema = z.object({
  title: z.string(),
});

export const noteContentUpdateSchema = z.object({
  content: z.array(EditorNodeSchema),
});

export const noteFavoriteUpdateSchema = z.object({
  isFavorite: z.boolean(),
});

export const noteFontUpdateSchema = z.object({
  font: z.enum(FONT_TYPES),
});

export const noteSmallTextUpdateSchema = z.object({
  smallText: z.boolean(),
});

export const noteLockedUpdateSchema = z.object({
  locked: z.boolean(),
});

export const noteFullWidthUpdateSchema = z.object({
  fullWidth: z.boolean(),
});

export const noteFolderUpdateSchema = z.object({
  folderId: z.number(),
});

export type Note = RouterOutputs["note"]["get"];
export type NoteTitleUpdate = z.infer<typeof noteTitleUpdateSchema>;
export type NoteContentUpdate = z.infer<typeof noteContentUpdateSchema>;
export type NoteFavoriteUpdate = z.infer<typeof noteFavoriteUpdateSchema>;
export type NoteFontUpdate = z.infer<typeof noteFontUpdateSchema>;
export type NoteSmallTextUpdate = z.infer<typeof noteSmallTextUpdateSchema>;
export type NoteLockedUpdate = z.infer<typeof noteLockedUpdateSchema>;
export type NoteFullWidthUpdate = z.infer<typeof noteFullWidthUpdateSchema>;
export type NoteFolderUpdate = z.infer<typeof noteFolderUpdateSchema>;
