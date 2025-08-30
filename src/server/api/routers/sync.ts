import { syncOperationSchema } from "@/lib/schema/sync";
import { tryCatch } from "@/lib/try-catch";
import type { SyncOperation } from "@/local/schema/sync";
import { authedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { DB } from "@/server/db";
import { type UserDataSyncedEvent } from "@/sync/emitter";
import { TRPCError } from "@trpc/server";
import { on } from "events";
import z from "zod";

export const syncRouter = createTRPCRouter({
  onSyncOperation: authedProcedure.subscription(async function* (opts) {
    const userId = opts.ctx.session.user.id;
    for await (const [data] of on(opts.ctx.syncEventEmitter, "userDataSynced", {
      signal: opts.signal,
    })) {
      const userDataSyncedEvent = data as UserDataSyncedEvent;

      if (userDataSyncedEvent.userId !== userId) {
        continue;
      }

      yield userDataSyncedEvent;
    }
  }),

  syncOperations: authedProcedure
    .input(z.array(syncOperationSchema))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      if (!checkUserIds(input, userId)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid user ID",
        });
      }

      if (!checkStatus(input)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "All operations must be pending",
        });
      }

      const results = [];
      for (const op of input) {
        let result;
        const { operation } = op;

        try {
          switch (operation.type) {
            case "createFolder":
              result = await DB.folders.mutations.create(
                operation.folderId,
                userId,
                operation.data,
              );
              break;
            case "updateFolder":
              result = await DB.folders.mutations.update(
                operation.folderId,
                userId,
                operation.data,
              );
              break;
            case "reorderFolders":
              result = await DB.folders.mutations.reorder(
                userId,
                operation.data,
              );
              break;
            case "deleteFolder":
              result = await DB.folders.mutations.delete(
                operation.folderId,
                userId,
              );
              break;
            case "createNote":
              result = await DB.notes.mutations.create(
                operation.noteId,
                userId,
                operation.data,
              );
              break;
            case "updateNoteTitle":
              result = await DB.notes.mutations.updateTitle(
                operation.noteId,
                userId,
                operation.data,
              );
              break;
            case "updateNoteContent":
              result = await DB.notes.mutations.updateContent(
                operation.noteId,
                userId,
                operation.data,
              );
              break;
            case "updateNoteFavorite":
              result = await DB.notes.mutations.updateFavorite(
                operation.noteId,
                userId,
                operation.data,
              );
              break;
            case "updateNoteTrash":
              result = await DB.notes.mutations.updateTrash(
                operation.noteId,
                userId,
                operation.data,
              );
              break;
            case "updateNoteArchive":
              result = await DB.notes.mutations.updateArchive(
                operation.noteId,
                userId,
                operation.data,
              );
              break;
            case "updateNoteFont":
              result = await DB.notes.mutations.updateFont(
                operation.noteId,
                userId,
                operation.data,
              );
              break;
            case "updateNoteSmallText":
              result = await DB.notes.mutations.updateSmallText(
                operation.noteId,
                userId,
                operation.data,
              );
              break;
            case "updateNoteLocked":
              result = await DB.notes.mutations.updateLocked(
                operation.noteId,
                userId,
                operation.data,
              );
              break;
            case "updateNoteFullWidth":
              result = await DB.notes.mutations.updateFullWidth(
                operation.noteId,
                userId,
                operation.data,
              );
              break;
            case "updateNoteFolder":
              result = await DB.notes.mutations.updateFolder(
                operation.noteId,
                userId,
                operation.data,
              );
              break;
            case "deleteNote":
              result = await DB.notes.mutations.delete(
                operation.noteId,
                userId,
              );
              break;
            default:
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const _: never = operation;
              throw new Error("Invalid operation type:");
          }

          results.push({
            id: op.id,
            status: "success" as const,
          });
        } catch (error) {
          console.error(`Error processing operation ${op.id}:`, error);

          results.push({
            id: op.id,
            status: "error" as const,
          });

          break;
        }
      }

      const eventData = {
        userId,
        results,
      };

      ctx.syncEventEmitter.emit("userDataSynced", eventData);
      return results;
    }),

  pull: authedProcedure
    .input(
      z.object({
        since: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const result = await tryCatch(
        Promise.all([
          DB.folders.queries.getAllSince(userId, input.since),
          DB.notes.queries.getAllSince(userId, input.since),
        ]),
      );

      if (result.error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to pull data",
        });
      }

      return {
        now: Date.now(),
        folders: result.data[0],
        notes: result.data[1],
      };
    }),
});

function checkUserIds(operations: SyncOperation[], userId: string) {
  return operations.every((op) => op.userId === userId);
}

function checkStatus(operations: SyncOperation[]) {
  return operations.every((op) => op.status === "pending");
}
