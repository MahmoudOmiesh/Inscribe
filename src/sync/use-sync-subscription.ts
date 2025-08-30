import { api } from "@/trpc/react";
import { useEffect } from "react";
import type { UserDataSyncedEvent } from "./emitter";

export function useSyncSubscription(
  onUpdate: (data: UserDataSyncedEvent) => void,
) {
  const subscription = api.sync.onSyncOperation.useSubscription(undefined, {
    enabled: true,
    onData(data) {
      onUpdate(data);
    },
    onError(error) {
      console.log("sync subscription error", error);
    },
  });

  useEffect(() => {
    return () => {
      subscription.reset();
    };
  }, [subscription]);
}
