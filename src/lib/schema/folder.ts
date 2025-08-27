import z from "zod";

export const FolderInsertSchema = z.object({
  emoji: z.string().min(1, "Emoji is required"),
  name: z.string().min(1, "Folder name is required"),
});

export const FolderOrderSchema = z.array(
  z.object({
    id: z.string(),
    order: z.number().positive().int(),
  }),
);

export type FolderInsert = z.infer<typeof FolderInsertSchema>;
export type FolderOrder = z.infer<typeof FolderOrderSchema>;
