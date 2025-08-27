import { syncOperationSchema } from "@/lib/schema/sync";
import type { SyncOperation } from "@/local/schema/sync";
import { authedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { DB } from "@/server/db";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const syncRouter = createTRPCRouter({
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

          console.log(
            `Successfully processed operation ${op.id} with result:`,
            result,
          );

          results.push({
            id: op.id,
            status: "success",
          });
        } catch (error) {
          console.error(`Error processing operation ${op.id}:`, error);

          results.push({
            id: op.id,
            status: "error",
          });

          break;
        }
      }

      return results;
    }),
});

function checkUserIds(operations: SyncOperation[], userId: string) {
  return operations.every((op) => op.userId === userId);
}

function checkStatus(operations: SyncOperation[]) {
  return operations.every((op) => op.status === "pending");
}
