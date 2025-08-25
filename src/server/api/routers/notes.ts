import { DB } from "@/server/db";
import { createTRPCRouter, authedProcedure } from "../trpc";
import { tryCatch } from "@/lib/try-catch";
import z from "zod";
import { TRPCError } from "@trpc/server";
import {
  noteContentUpdateSchema,
  noteFavoriteUpdateSchema,
  noteFolderUpdateSchema,
  noteFontUpdateSchema,
  noteFullWidthUpdateSchema,
  noteLockedUpdateSchema,
  noteSmallTextUpdateSchema,
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
  updateFont: {
    internal: {
      code: "INTERNAL_SERVER_ERROR" as const,
      message: "Failed to update note font",
    },
  },
  updateSmallText: {
    internal: {
      code: "INTERNAL_SERVER_ERROR" as const,
      message: "Failed to update note small text",
    },
  },
  updateLocked: {
    internal: {
      code: "INTERNAL_SERVER_ERROR" as const,
      message: "Failed to update note locked",
    },
  },
  updateFullWidth: {
    internal: {
      code: "INTERNAL_SERVER_ERROR" as const,
      message: "Failed to update note full width",
    },
  },
  updateFolder: {
    internal: {
      code: "INTERNAL_SERVER_ERROR" as const,
      message: "Failed to update note folder",
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
    .input(noteFavoriteUpdateSchema.extend({ noteId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const { data, error } = await tryCatch(
        DB.notes.mutations.toggleFavorite(
          input.noteId,
          ctx.session.user.id,
          input,
        ),
      );

      if (error) {
        throw new TRPCError(NOTE_ERRORS.toggleFavorite.internal);
      }

      return data;
    }),

  updateFont: authedProcedure
    .input(noteFontUpdateSchema.extend({ noteId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await tryCatch(
        DB.notes.mutations.updateFont(input.noteId, ctx.session.user.id, input),
      );

      if (error) {
        throw new TRPCError(NOTE_ERRORS.updateFont.internal);
      }

      return data;
    }),

  updateSmallText: authedProcedure
    .input(noteSmallTextUpdateSchema.extend({ noteId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await tryCatch(
        DB.notes.mutations.updateSmallText(
          input.noteId,
          ctx.session.user.id,
          input,
        ),
      );

      if (error) {
        throw new TRPCError(NOTE_ERRORS.updateSmallText.internal);
      }

      return data;
    }),

  updateLocked: authedProcedure
    .input(noteLockedUpdateSchema.extend({ noteId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await tryCatch(
        DB.notes.mutations.updateLocked(
          input.noteId,
          ctx.session.user.id,
          input,
        ),
      );

      if (error) {
        throw new TRPCError(NOTE_ERRORS.updateLocked.internal);
      }

      return data;
    }),

  updateFullWidth: authedProcedure
    .input(noteFullWidthUpdateSchema.extend({ noteId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await tryCatch(
        DB.notes.mutations.updateFullWidth(
          input.noteId,
          ctx.session.user.id,
          input,
        ),
      );

      if (error) {
        throw new TRPCError(NOTE_ERRORS.updateFullWidth.internal);
      }

      return data;
    }),

  updateFolder: authedProcedure
    .input(noteFolderUpdateSchema.extend({ noteId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await tryCatch(
        DB.notes.mutations.updateFolder(
          input.noteId,
          ctx.session.user.id,
          input,
        ),
      );

      if (error) {
        throw new TRPCError(NOTE_ERRORS.updateFolder.internal);
      }

      return data;
    }),
});
