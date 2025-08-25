import type { RouterOutputs } from "@/trpc/react";
import z from "zod";

export interface LocalFolder {
  id: string;
  userId: string;
  serverId: string | null;

  emoji: string;
  name: string;
  sortOrder: number;

  createdAt: number;
  updatedAt: number;

  lastSyncedAt: number | null;
}

export const folderInsertSchema = z.object({
  emoji: z.string().min(1, "Emoji is required"),
  name: z.string().min(1, "Folder name is required"),
});

export const folderOrderSchema = z.array(
  z.object({
    id: z.string(),
    order: z.number().positive().int(),
  }),
);

export type Folder = RouterOutputs["user"]["getFolders"][number];
export type FolderInsert = z.infer<typeof folderInsertSchema>;
export type FolderOrder = z.infer<typeof folderOrderSchema>;
