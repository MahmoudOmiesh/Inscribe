import { DB } from "@/server/db";
import { createTRPCRouter, authedProcedure } from "../trpc";
import { tryCatch } from "@/lib/try-catch";
import z from "zod";
import { TRPCError } from "@trpc/server";
import {
  noteContentUpdateSchema,
  noteTitleUpdateSchema,
} from "@/lib/schema/note";

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
  create: {
    internal: {
      code: "INTERNAL_SERVER_ERROR" as const,
      message: "Failed to create note",
    },
  },
  duplicate: {
    internal: {
      code: "INTERNAL_SERVER_ERROR" as const,
      message: "Failed to duplicate note",
    },
  },
  updateTitle: {
    internal: {
      code: "INTERNAL_SERVER_ERROR" as const,
      message: "Failed to update note title",
    },
  },
  updateContent: {
    internal: {
      code: "INTERNAL_SERVER_ERROR" as const,
      message: "Failed to update note content",
    },
  },
  toggleFavorite: {
    internal: {
      code: "INTERNAL_SERVER_ERROR" as const,
      message: "Failed to toggle favorite",
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

  create: authedProcedure
    .input(z.object({ folderId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await tryCatch(
        DB.notes.mutations.create(input.folderId, ctx.session.user.id),
      );

      if (error) {
        throw new TRPCError(NOTE_ERRORS.create.internal);
      }

      return data;
    }),

  duplicate: authedProcedure
    .input(z.object({ noteId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await tryCatch(
        DB.notes.mutations.duplicate(input.noteId, ctx.session.user.id),
      );

      if (error) {
        throw new TRPCError(NOTE_ERRORS.duplicate.internal);
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

  updateContent: authedProcedure
    .input(noteContentUpdateSchema.extend({ noteId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await tryCatch(
        DB.notes.mutations.updateContent(
          input.noteId,
          ctx.session.user.id,
          input,
        ),
      );

      if (error) {
        throw new TRPCError(NOTE_ERRORS.updateContent.internal);
      }

      return data;
    }),

  toggleFavorite: authedProcedure
    .input(z.object({ noteId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await tryCatch(
        DB.notes.mutations.toggleFavorite(input.noteId, ctx.session.user.id),
      );

      if (error) {
        throw new TRPCError(NOTE_ERRORS.toggleFavorite.internal);
      }

      return data;
    }),
});
