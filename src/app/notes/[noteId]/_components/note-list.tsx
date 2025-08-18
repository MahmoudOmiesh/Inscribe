"use client";

import { Button } from "@/components/ui/button";
import {
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontalIcon,
  StarIcon,
  ArchiveIcon,
  LinkIcon,
  CopyIcon,
  CornerUpRightIcon,
  Trash2Icon,
  ExternalLinkIcon,
  AlertTriangleIcon,
} from "lucide-react";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NOTE_MUTATIONS } from "../mutations";

export function NoteList({ folderId }: { folderId: number }) {
  const pathname = usePathname();

  const [notes] = api.folder.getNotes.useSuspenseQuery({ folderId: folderId });
  const isEmpty = notes.length === 0;

  const duplicate = NOTE_MUTATIONS.duplicate(folderId);

  return (
    <SidebarMenuSub
      className={cn("mr-0 pr-[0.3rem]", isEmpty && "ml-0 border-l-0")}
    >
      {isEmpty && (
        <SidebarMenuSubItem className="text-muted-foreground flex h-8 w-full items-center justify-center gap-2 text-center text-sm italic">
          <p>This folder is empty</p>
        </SidebarMenuSubItem>
      )}
      {notes.map((note) => (
        <SidebarMenuSubItem
          key={note.id}
          className="flex w-full items-center justify-between gap-2"
        >
          <SidebarMenuSubButton
            asChild
            isActive={pathname === `/notes/${note.id}`}
            tabIndex={0}
            className="flex w-full items-center justify-between gap-2 truncate"
          >
            <Link href={`/notes/${note.id}`}>{note.title}</Link>
          </SidebarMenuSubButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                title="More"
                variant="ghost"
                size="icon"
                className="size-5"
              >
                <MoreHorizontalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <StarIcon /> Add to Favorites
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArchiveIcon /> Archive Note
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <LinkIcon /> Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    duplicate.mutate({ noteId: note.id });
                  }}
                >
                  <CopyIcon /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CornerUpRightIcon /> Move To
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Trash2Icon /> Move to Trash
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <ExternalLinkIcon />
                  Open in New Tab
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <AlertTriangleIcon className="text-destructive" />
                  Delete Permanently
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuSubItem>
      ))}
    </SidebarMenuSub>
  );
}
