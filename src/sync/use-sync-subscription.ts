import { api } from "@/trpc/react";
import { useEffect } from "react";

export function useSyncSubscription() {
  const subscription = api.sync.onSyncOperation.useSubscription(undefined, {
    enabled: true,
    onStarted() {
      console.log("sync subscription started");
    },
    onData(data) {
      console.log("sync subscription data", data);
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
