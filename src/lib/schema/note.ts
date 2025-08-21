import { EditorNodeSchema } from "@/text-editor/model/zod";
import type { RouterOutputs } from "@/trpc/react";
import z from "zod";

export const noteTitleUpdateSchema = z.object({
  title: z.string(),
});

export const noteContentUpdateSchema = z.object({
  content: z.array(EditorNodeSchema),
});

export type Note = RouterOutputs["note"]["get"];
export type NoteTitleUpdate = z.infer<typeof noteTitleUpdateSchema>;
export type NoteContentUpdate = z.infer<typeof noteContentUpdateSchema>;
