import { api } from "@/trpc/react";

export function useSyncSubscription() {
  const subscription = api.sync.onSyncOperation.useSubscription(undefined, {
    onData(data) {
      console.log(data);
    },
  });
}
