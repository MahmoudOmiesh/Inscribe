import type { RouterOutputs } from "@/trpc/react";
import z from "zod";

export const folderInsertSchema = z.object({
  emoji: z.string().min(1, "Emoji is required"),
  name: z.string().min(1, "Folder name is required"),
});

export type Folder = RouterOutputs["user"]["getFolders"][number];
export type FolderInsert = z.infer<typeof folderInsertSchema>;
