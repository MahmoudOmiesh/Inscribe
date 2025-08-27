"use client";

import { operationQueue } from "@/sync/operation-queue";
import { useSync } from "@/sync/use-sync";
import { useEffect } from "react";

export function SyncHandler({ children }: { children: React.ReactNode }) {
  const sync = useSync();

  useEffect(() => {
    operationQueue.setSyncTrigger(sync);
  }, [sync]);

  return children;
}
