"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { ChevronRight, MoreHorizontal, PlusIcon } from "lucide-react";
import type { LocalFolder } from "@/local/schema/folder";
import { useLocalFolders } from "@/local/queries/folders";
import { FolderForm, FolderMoreDropdown } from "./utils";
import { HoverButton } from "@/components/hover-button";
import { FolderEmptyState, FolderLoadingState } from "./states";
import { NoteList } from "../../../[noteId]/_components/lists/note-list";
import { createLocalNote } from "@/local/mutations/notes";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useUserId } from "../../user-context";
import { useDelayedVisible } from "@/hooks/use-delayed-visible";
import {
  createLocalFolder,
  updateLocalFolder,
} from "@/local/mutations/folders";
import { useEffect, useState } from "react";
import type { FolderInsert } from "@/lib/schema/folder";

export function NotesSidebarFolders() {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [optimisticFolder, setOptimisticFolder] = useState<
    (FolderInsert & { id?: string }) | null
  >(null);

  const userId = useUserId();
  const folders = useLocalFolders();

  const createFolder = useMutation({
    mutationFn: createLocalFolder,
    onMutate: () => {
      setIsCreatingFolder(false);
    },
    onSuccess: (id) => {
      setOptimisticFolder((prev) => (prev ? { ...prev, id } : null));
    },
    onError: () => {
      setOptimisticFolder(null);
    },
    meta: {
      toastOnError: "Failed to create folder. Please try again.",
    },
    networkMode: "always",
  });

  const showLoading = useDelayedVisible(!folders);

  useEffect(() => {
    if (
      optimisticFolder &&
      folders?.some((folder) => folder.id === optimisticFolder.id)
    ) {
      setOptimisticFolder(null);
    }
  }, [optimisticFolder, folders]);

  return (
    <Collapsible defaultOpen>
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="group/button justify-start">
              Folders
              <div className="ml-auto flex items-center">
                <HoverButton
                  title="Add Folder"
                  className="lg:opacity-100"
                  onClick={() => setIsCreatingFolder(true)}
                >
                  <PlusIcon />
                </HoverButton>
              </div>
            </Button>
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {!folders ? (
                showLoading ? (
                  <FolderLoadingState />
                ) : null
              ) : folders.length === 0 ? (
                <FolderEmptyState />
              ) : (
                folders.map((folder, idx) => (
                  <NotesSiderbarFolder
                    key={folder.id}
                    folder={folder}
                    defaultOpen={idx === 0}
                  />
                ))
              )}
              {optimisticFolder && (
                <NotesSiderbarFolder
                  folder={{
                    ...optimisticFolder,
                    id: "optimistic",
                    userId: userId,
                    sortOrder: 0,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                  }}
                />
              )}
              {isCreatingFolder && (
                <FolderForm
                  defaultValues={{ emoji: "📄", name: "New Folder" }}
                  onSubmit={(data) => {
                    setOptimisticFolder(data);
                    createFolder.mutate({ userId, data });
                  }}
                />
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

function NotesSiderbarFolder({
  folder,
  defaultOpen,
}: {
  folder: LocalFolder;
  defaultOpen?: boolean;
}) {
  const [isRenamingFolder, setIsRenamingFolder] = useState(false);
  const [optimisticFolder, setOptimisticFolder] = useState<FolderInsert | null>(
    null,
  );
  const router = useRouter();
  const userId = useUserId();

  const createNote = useMutation({
    mutationFn: createLocalNote,
    onSuccess: (id) => {
      router.push(`/notes/${id}`);
    },
    meta: {
      toastOnError: "Failed to create note. Please try again.",
    },
    networkMode: "always",
  });

  const updateFolder = useMutation({
    mutationFn: updateLocalFolder,
    onMutate: () => {
      setIsRenamingFolder(false);
    },
    onError: () => {
      setOptimisticFolder(null);
    },
    meta: {
      toastOnError: "Failed to update folder. Please try again.",
    },
    networkMode: "always",
  });

  useEffect(() => {
    if (
      optimisticFolder &&
      optimisticFolder.name === folder.name &&
      optimisticFolder.emoji === folder.emoji
    ) {
      setOptimisticFolder(null);
    }
  }, [folder.name, folder.emoji, optimisticFolder]);

  const folderName = optimisticFolder?.name ?? folder.name;
  const folderEmoji = optimisticFolder?.emoji ?? folder.emoji;

  return (
    <Collapsible defaultOpen={defaultOpen}>
      <SidebarMenuItem>
        {isRenamingFolder ? (
          <FolderForm
            defaultValues={{ emoji: folder.emoji, name: folder.name }}
            onSubmit={(data) => {
              setOptimisticFolder(data);
              updateFolder.mutate({ userId, folderId: folder.id, data });
            }}
          />
        ) : (
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="group/button relative mb-0.5 gap-0 hover:pr-10 focus-visible:pr-10">
              <div className="flex size-4 items-center justify-center">
                <span className="group-hover/button:hidden group-focus-visible/button:hidden">
                  {folderEmoji}
                </span>
                <ChevronRight className="text-primary hidden transition-transform group-hover/button:block group-focus-visible/button:block group-data-[state=open]/button:rotate-90" />
              </div>
              <div className="ml-2 truncate group-hover/button:mr-2 group-focus-visible/button:mr-2">
                {folderName}
              </div>
              <div className="absolute top-1/2 right-1 flex -translate-y-1/2 items-center gap-1 transition-opacity duration-100 group-hover/button:opacity-100 lg:opacity-0">
                <FolderMoreDropdown
                  side="right"
                  align="start"
                  folder={folder}
                  onRename={() => setIsRenamingFolder(true)}
                >
                  <HoverButton title="More...">
                    <MoreHorizontal />
                  </HoverButton>
                </FolderMoreDropdown>
                <HoverButton
                  title="Add Note"
                  onClick={() =>
                    createNote.mutate({ userId, folderId: folder.id })
                  }
                >
                  <PlusIcon />
                </HoverButton>
              </div>
            </SidebarMenuButton>
          </CollapsibleTrigger>
        )}
        <CollapsibleContent>
          <NoteList folderId={folder.id} />
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
