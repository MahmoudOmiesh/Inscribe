"use client";

import { Button } from "@/components/ui/button";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { createLocalFolder } from "@/local/mutations/folders";
import { useUserId } from "../../user-context";
import { useMutation } from "@tanstack/react-query";

export function FolderLoadingState() {
  return (
    <div className="space-y-2 p-1">
      {Array.from({ length: 4 }).map((_, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuButton asChild>
            <Skeleton className="h-7 w-full cursor-default" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </div>
  );
}

export function FolderEmptyState() {
  const userId = useUserId();
  const createFolder = useMutation({
    mutationFn: createLocalFolder,
    networkMode: "always",
  });

  return (
    <div className="text-center">
      <p className="text-muted-foreground text-sm">You have no folders yet</p>
      <Button
        variant="link"
        size="sm"
        className="h-fit"
        onClick={() =>
          createFolder.mutate({
            userId,
            data: { emoji: "📄", name: "New Folder" },
          })
        }
      >
        Create a new folder
      </Button>
    </div>
  );
}
