"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { mutationStatusStore } from "@/lib/mutation-status-store";
import { CloudAlertIcon, CloudCheckIcon, RefreshCcwIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";

export function MutationStatusIndicator() {
  const [visible, setVisible] = useState(false);
  const { active, status } = useSyncExternalStore(
    mutationStatusStore.subscribe,
    mutationStatusStore.getSnapshot,
    mutationStatusStore.getSnapshot,
  );

  useEffect(() => {
    if (active > 0) {
      setVisible(true);
      return;
    }

    if (status === "success") {
      const timeout = setTimeout(() => {
        setVisible(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [active, status]);

  if (!visible) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-default">
          {status === "syncing" && <RefreshCcwIcon className="animate-spin" />}
          {status === "success" && <CloudCheckIcon />}
          {status === "error" && <CloudAlertIcon />}
        </Button>
      </TooltipTrigger>
      <TooltipContent variant="muted" className="text-xs italic">
        {status === "syncing" && "Syncing changes..."}
        {status === "success" && "Changes synced"}
        {status === "error" &&
          "A problem occurred while syncing changes, please check your internet connection and try again."}
      </TooltipContent>
    </Tooltip>
  );
}
