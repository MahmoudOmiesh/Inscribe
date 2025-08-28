"use client";

import { mutationStatusStore } from "@/lib/mutation-status-store";
import { api } from "@/trpc/react";
import { operationQueue } from "./operation-queue";
import { tryCatch } from "@/lib/try-catch";
import { useCallback, useEffect } from "react";
import { useUserId } from "@/app/notes/_components/user-context";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { getLastPulledAt } from "@/local/queries/sync-meta";
import { localDB } from "@/local/db";
import {
  setLastPulledAt,
  updateFoldersFromPull,
  updateNotesFromPull,
} from "@/local/mutations/sync-meta";

export function useSync() {
  const syncMutation = api.sync.syncOperations.useMutation();
  const utils = api.useUtils();
  const userId = useUserId();

  const applyPull = useCallback(async () => {
    const since = (await getLastPulledAt(userId)) ?? 0;
    const pulled = await tryCatch(
      utils.sync.pull.fetch({
        since,
      }),
    );

    if (pulled.error) {
      throw new Error("Failed to pull data");
    }

    const { data } = pulled;

    await localDB.transaction(
      "rw",
      [localDB.folders, localDB.notes, localDB.syncMeta],
      async () => {
        if (data.folders.length > 0) {
          await updateFoldersFromPull(data.folders);
        }

        if (data.notes.length > 0) {
          await updateNotesFromPull(data.notes);
        }

        await setLastPulledAt(userId, data.now);
      },
    );
  }, [userId, utils.sync.pull]);

  const sync = useCallback(async () => {
    mutationStatusStore.start();

    const pendingOperations = await operationQueue.getPendingOperations(userId);
    if (pendingOperations.length === 0) {
      mutationStatusStore.success();
      return;
    }

    const results = await tryCatch(syncMutation.mutateAsync(pendingOperations));
    if (results.error) {
      mutationStatusStore.error();
      return;
    }

    const syncedIds = results.data
      .filter((r) => r.status === "success")
      .map((r) => r.id);
    await operationQueue.removeSyncedOperations(syncedIds);

    const { error: applyError } = await tryCatch(applyPull());
    if (applyError) {
      mutationStatusStore.error();
      return;
    }

    mutationStatusStore.success();
  }, [syncMutation, userId, applyPull]);

  useEffect(() => {
    void tryCatch(applyPull());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debouncedSync = useDebouncedCallback(() => {
    void sync();
  }, 1000);

  return debouncedSync;
}
