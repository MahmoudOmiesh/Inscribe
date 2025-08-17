import { DB } from "@/server/db";
import { createTRPCRouter, authedProcedure } from "../trpc";
import { tryCatch } from "@/lib/try-catch";
import z from "zod";
import { TRPCError } from "@trpc/server";
import { noteTitleUpdateSchema } from "@/lib/schema/note";

const NOTE_ERRORS = {
  get: {
    internal: {
      code: "INTERNAL_SERVER_ERROR" as const,
      message: "Failed to get note",
    },
    notFound: {
      code: "NOT_FOUND" as const,
      message: "Note not found",
    },
  },
  updateTitle: {
    internal: {
      code: "INTERNAL_SERVER_ERROR" as const,
      message: "Failed to update note title",
    },
  },
};

export const noteRouter = createTRPCRouter({
  get: authedProcedure
    .input(z.object({ noteId: z.number() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await tryCatch(
        DB.notes.queries.get(input.noteId, ctx.session.user.id),
      );

      if (error) {
        throw new TRPCError(NOTE_ERRORS.get.internal);
      }

      if (!data) {
        throw new TRPCError(NOTE_ERRORS.get.notFound);
      }

      return data;
    }),

  updateTitle: authedProcedure
    .input(noteTitleUpdateSchema.extend({ noteId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await tryCatch(
        DB.notes.mutations.updateTitle(
          input.noteId,
          ctx.session.user.id,
          input,
        ),
      );

      if (error) {
        throw new TRPCError(NOTE_ERRORS.updateTitle.internal);
      }

      return data;
    }),
});
