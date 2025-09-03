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
import { FolderCreateDropdown, FolderMoreDropdown } from "./utils";
import { HoverButton } from "@/components/hover-button";
import { FolderEmptyState, FolderLoadingState } from "./states";
import { NoteList } from "../../../[noteId]/_components/lists/note-list";
import { createLocalNote } from "@/local/mutations/notes";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useUserId } from "../../user-context";
import { useDelayedVisible } from "@/hooks/use-delayed-visible";

export function NotesSidebarFolders() {
  const folders = useLocalFolders();

  const showLoading = useDelayedVisible(!folders);

  return (
    <Collapsible defaultOpen>
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="group/button justify-start">
              Folders
              <div className="ml-auto flex items-center">
                <FolderCreateDropdown
                  side="bottom"
                  align="center"
                  alignOffset={10}
                >
                  <HoverButton title="Add Folder">
                    <PlusIcon />
                  </HoverButton>
                </FolderCreateDropdown>
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

  return (
    <Collapsible defaultOpen={defaultOpen}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="group/button relative gap-0 hover:pr-10 focus-visible:pr-10">
            <div className="flex size-4 items-center justify-center">
              <span className="group-hover/button:hidden group-focus-visible/button:hidden">
                {folder.emoji}
              </span>
              <ChevronRight className="text-primary hidden transition-transform group-hover/button:block group-focus-visible/button:block group-data-[state=open]/button:rotate-90" />
            </div>
            <div className="ml-2 truncate group-hover/button:mr-2 group-focus-visible/button:mr-2">
              {folder.name}
            </div>
            <div className="absolute top-1/2 right-1 flex -translate-y-1/2 items-center gap-1 transition-opacity duration-100 group-hover/button:opacity-100 lg:opacity-0">
              <FolderMoreDropdown side="right" align="start" folder={folder}>
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
        <CollapsibleContent>
          <NoteList folderId={folder.id} />
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
