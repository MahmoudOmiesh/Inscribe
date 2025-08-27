"use client";

import { mutationStatusStore } from "@/lib/mutation-status-store";
import { api } from "@/trpc/react";
import { operationQueue } from "./operation-queue";
import { tryCatch } from "@/lib/try-catch";
import { useCallback } from "react";
import { useUserId } from "@/app/notes/_components/user-context";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

export function useSync() {
  const syncMutation = api.sync.syncOperations.useMutation();
  const userId = useUserId();

  const sync = useCallback(async () => {
    mutationStatusStore.start();

    const pendingOperations = await tryCatch(
      operationQueue.getPendingOperations(userId),
    );

    if (pendingOperations.error) {
      mutationStatusStore.error();
      return;
    }

    if (pendingOperations.data.length === 0) {
      mutationStatusStore.success();
      return;
    }

    const results = await tryCatch(
      syncMutation.mutateAsync(pendingOperations.data),
    );

    if (results.error) {
      mutationStatusStore.error();
      return;
    }

    const syncedIds = results.data
      .filter((r) => r.status === "success")
      .map((r) => r.id);

    await operationQueue.removeSyncedOperations(syncedIds);

    mutationStatusStore.success();
  }, [syncMutation, userId]);

  const debouncedSync = useDebouncedCallback(() => {
    void sync();
  }, 1000);

  return debouncedSync;
}
