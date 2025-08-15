import { folderInsertSchema, folderOrderSchema } from "@/lib/schema/folder";
import { tryCatch } from "@/lib/try-catch";
import { createTRPCRouter, authedProcedure } from "@/server/api/trpc";
import { DB } from "@/server/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const FOLDER_ERRORS = {
  create: {
    internal: {
      code: "INTERNAL_SERVER_ERROR" as const,
      message: "Failed to create folder",
    },
  },
  update: {
    internal: {
      code: "INTERNAL_SERVER_ERROR" as const,
      message: "Failed to update folder",
    },
    notFound: {
      code: "NOT_FOUND" as const,
      message: "Folder not found",
    },
  },
  delete: {
    internal: {
      code: "INTERNAL_SERVER_ERROR" as const,
      message: "Failed to delete folder",
    },
    notFound: {
      code: "NOT_FOUND" as const,
      message: "Folder not found",
    },
  },
  reorder: {
    internal: {
      code: "INTERNAL_SERVER_ERROR" as const,
      message: "Failed to reorder folders",
    },
  },
};

export const folderRouter = createTRPCRouter({
  create: authedProcedure
    .input(folderInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const { data: folder, error } = await tryCatch(
        DB.folders.mutations.create(ctx.session.user.id, input),
      );

      if (error) {
        throw new TRPCError(FOLDER_ERRORS.create.internal);
      }

      return folder;
    }),

  update: authedProcedure
    .input(folderInsertSchema.extend({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id: inputId, ...rest } = input;
      const { data, error } = await tryCatch(
        DB.folders.mutations.update(inputId, ctx.session.user.id, rest),
      );

      if (error) {
        throw new TRPCError(FOLDER_ERRORS.update.internal);
      }

      if (data.count === 0) {
        throw new TRPCError(FOLDER_ERRORS.update.notFound);
      }

      return { id: data.id };
    }),

  delete: authedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await tryCatch(
        DB.folders.mutations.delete(input.id, ctx.session.user.id),
      );

      if (error) {
        throw new TRPCError(FOLDER_ERRORS.delete.internal);
      }

      if (data.count === 0) {
        throw new TRPCError(FOLDER_ERRORS.delete.notFound);
      }

      return { id: data.id };
    }),

  reorder: authedProcedure
    .input(folderOrderSchema)
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await tryCatch(
        DB.folders.mutations.reorder(ctx.session.user.id, input),
      );

      if (error) {
        throw new TRPCError(FOLDER_ERRORS.reorder.internal);
      }

      return data;
    }),
});
