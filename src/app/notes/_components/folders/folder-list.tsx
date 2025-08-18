"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Spinner } from "@/components/spinner";
import * as Sortable from "@/components/ui/sortable";
import {
  ChevronRight,
  FolderPenIcon,
  GripVerticalIcon,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Popover,
  PopoverGroup,
  PopoverItem,
  PopoverTrigger,
  PopoverContent,
  PopoverSeparator,
} from "@/components/ui/popover";
import {
  FolderCreateDialog,
  FolderDeleteDialog,
  FolderRenameDialog,
} from "./folder-dialogs";
import { type Folder } from "@/lib/schema/folder";
import { useFolderSorting } from "./folder-sorting";
import { api } from "@/trpc/react";
import { useState } from "react";
import { ErrorSuspenseBoundary } from "@/components/error-suspense-boundary";
import { NoteList } from "../../[noteId]/_components/note-list";
import { useRouter } from "next/navigation";

export function FoldersList() {
  const { isSorting, setIsSorting } = useFolderSorting();
  const [folders] = api.user.getFolders.useSuspenseQuery();

  return (
    <>
      {isSorting ? (
        <FolderSortable folders={folders} setIsSorting={setIsSorting} />
      ) : folders.length === 0 ? (
        <div className="flex h-16 items-center justify-center p-2">
          <p className="text-muted-foreground text-center text-sm italic">
            No folders found.{" "}
            {
              <FolderCreateDialog>
                <span className="text-blue-500 hover:underline">
                  Create a new folder
                </span>
              </FolderCreateDialog>
            }
          </p>
        </div>
      ) : (
        folders.map((folder) => <FolderItem key={folder.id} folder={folder} />)
      )}
    </>
  );
}

function FolderSortable({
  folders,
  setIsSorting,
}: {
  folders: Folder[];
  setIsSorting: (isSorting: boolean) => void;
}) {
  const [editedFolders, setEditedFolders] = useState(folders);
  const { setIsMutating } = useFolderSorting();

  const utils = api.useUtils();
  const reorderFolders = api.folder.reorder.useMutation({
    meta: {
      invalidateQueries: () => utils.user.getFolders.invalidate(),
    },
    onSettled: () => {
      setIsSorting(false);
      setIsMutating(false);
    },
  });

  function handleSave() {
    reorderFolders.mutate(
      editedFolders.map((folder, index) => ({
        id: folder.id,
        order: index + 1,
      })),
    );
    setIsMutating(true);
  }

  return (
    <>
      <Sortable.Root
        value={editedFolders}
        onValueChange={setEditedFolders}
        getItemValue={(item) => item.id}
        orientation="vertical"
      >
        <Sortable.Content className="flex flex-col gap-1">
          {editedFolders.map((folder) => (
            <Sortable.Item key={folder.id} value={folder.id} asChild asHandle>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start font-normal has-[>svg]:px-2"
              >
                <GripVerticalIcon />
                {folder.name}
              </Button>
            </Sortable.Item>
          ))}
        </Sortable.Content>
        <Sortable.Overlay>
          <div className="bg-accent dark:bg-accent/50 size-full rounded-md" />
        </Sortable.Overlay>
      </Sortable.Root>
      <Button
        size="sm"
        className="mt-2 w-full"
        disabled={reorderFolders.isPending}
        onClick={handleSave}
      >
        Save
        {reorderFolders.isPending && <Spinner />}
      </Button>
    </>
  );
}

function FolderItem({ folder }: { folder: Folder }) {
  const router = useRouter();
  const utils = api.useUtils();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  function prefetchNotes() {
    void utils.folder.getNotes.prefetch({ folderId: folder.id });
  }

  const createNote = api.note.create.useMutation({
    onMutate: () => {
      setIsPopoverOpen(false);
    },
    onSuccess: (data) => {
      router.push(`/notes/${data.id}`);
    },
    meta: {
      invalidateQueries: () =>
        utils.folder.getNotes.invalidate({ folderId: folder.id }),
    },
  });

  return (
    <Collapsible>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            className="group/collapsible"
            onMouseEnter={prefetchNotes}
            onFocus={prefetchNotes}
          >
            <span>
              {folder.emoji} {folder.name}
            </span>
            <ChevronRight className="ml-auto hidden transition-transform group-hover/collapsible:block group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <SidebarMenuAction showOnHover>
              <MoreHorizontal />
            </SidebarMenuAction>
          </PopoverTrigger>
          <PopoverContent align="center" side="right" className="w-fit">
            <PopoverGroup>
              <PopoverItem
                onClick={() => createNote.mutate({ folderId: folder.id })}
              >
                <Plus /> Add Note
              </PopoverItem>
              <FolderRenameDialog folder={folder}>
                <PopoverItem>
                  <FolderPenIcon /> Rename Folder
                </PopoverItem>
              </FolderRenameDialog>
            </PopoverGroup>
            <PopoverSeparator />
            <PopoverGroup>
              <FolderDeleteDialog folderId={folder.id}>
                <PopoverItem>
                  <Trash2 className="text-destructive" /> Delete Permanently
                </PopoverItem>
              </FolderDeleteDialog>
            </PopoverGroup>
          </PopoverContent>
        </Popover>
        <CollapsibleContent>
          <ErrorSuspenseBoundary>
            <NoteList folderId={folder.id} />
          </ErrorSuspenseBoundary>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
