import type { RouterOutputs } from "@/trpc/react";
import z from "zod";

export const noteTitleUpdateSchema = z.object({
  title: z.string(),
});

export type Note = RouterOutputs["note"]["get"];
export type NoteTitleUpdate = z.infer<typeof noteTitleUpdateSchema>;
