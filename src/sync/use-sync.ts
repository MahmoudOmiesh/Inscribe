"use client";

import { mutationStatusStore } from "@/lib/mutation-status-store";
import { api } from "@/trpc/react";
import { operationQueue } from "./operation-queue";
import { tryCatch } from "@/lib/try-catch";
import { useCallback, useEffect, useRef } from "react";
import { useUserId } from "@/app/notes/_components/user-context";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { getLastPulledAt } from "@/local/queries/sync-meta";
import { localDB } from "@/local/db";
import {
  setLastPulledAt,
  updateFoldersFromPull,
  updateNotesFromPull,
} from "@/local/mutations/sync-meta";
import { useSyncSubscription } from "./use-sync-subscription";

export function useSync() {
  const isSyncingRef = useRef(false);
  const isPullingRef = useRef(false);

  const syncMutation = api.sync.syncOperations.useMutation();
  const utils = api.useUtils();
  const userId = useUserId();

  const applyPull = useCallback(async () => {
    if (isSyncingRef.current || isPullingRef.current) {
      setTimeout(() => {
        void applyPull();
      }, 1000);
      return;
    }

    isPullingRef.current = true;

    const since = (await getLastPulledAt(userId)) ?? 0;
    const pulled = await tryCatch(
      utils.sync.pull.fetch({
        since,
      }),
    );

    if (pulled.error) {
      isPullingRef.current = false;
      throw new Error("Failed to pull data");
    }

    const { data } = pulled;

    await localDB.transaction(
      "rw",
      [
        localDB.folders,
        localDB.notes,
        localDB.syncMeta,
        localDB.syncOperations,
      ],
      async () => {
        if (data.folders.length > 0) {
          await updateFoldersFromPull(data.folders);
        }

        if (data.notes.length > 0) {
          await updateNotesFromPull(data.notes, userId);
        }

        await setLastPulledAt(userId, data.now);
      },
    );

    isPullingRef.current = false;
  }, [userId, utils.sync.pull]);

  const sync = useCallback(async () => {
    if (isSyncingRef.current || isPullingRef.current) {
      setTimeout(() => {
        void sync();
      }, 1000);
      return;
    }

    isSyncingRef.current = true;
    mutationStatusStore.start();

    const pendingOperations = await operationQueue.getPendingOperations(userId);
    if (pendingOperations.length === 0) {
      mutationStatusStore.success();
      isSyncingRef.current = false;
      return;
    }

    const results = await tryCatch(syncMutation.mutateAsync(pendingOperations));
    if (results.error) {
      mutationStatusStore.error();
      isSyncingRef.current = false;
      return;
    }

    const syncedIds = results.data
      .filter((r) => r.status === "success")
      .map((r) => r.id);
    await operationQueue.removeSyncedOperations(syncedIds);

    isSyncingRef.current = false;
    mutationStatusStore.success();
  }, [syncMutation, userId]);

  useSyncSubscription(() => {
    void tryCatch(applyPull());
  });

  useEffect(() => {
    void tryCatch(applyPull());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debouncedSync = useDebouncedCallback(() => {
    void tryCatch(sync());
  }, 1000);

  return debouncedSync;
}
