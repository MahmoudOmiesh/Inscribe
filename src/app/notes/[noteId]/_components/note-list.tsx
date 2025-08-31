"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
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
  StarIcon,
  ArchiveIcon,
  LinkIcon,
  CopyIcon,
  CornerUpRightIcon,
  Trash2Icon,
  ExternalLinkIcon,
  AlertTriangleIcon,
  FileIcon,
  MoreHorizontal,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useLocalFolderNotes } from "@/local/queries/folders";
import { HoverButton } from "@/components/hover-button";
import Link from "next/link";
import { NoteEmptyState, NoteLoadingState } from "./states";

export function NoteList({ folderId }: { folderId: string }) {
  const pathname = usePathname();
  const notes = useLocalFolderNotes(folderId);

  if (!notes) {
    return <NoteLoadingState />;
  }

  const isEmpty = notes.length === 0;

  return (
    <SidebarMenu>
      {isEmpty && <NoteEmptyState />}
      {notes.map((note) => (
        <SidebarMenuItem key={note.id}>
          <Link href={`/notes/${note.id}`}>
            <SidebarMenuButton
              className="group/button h-fit gap-0 py-1.5 pl-8"
              isActive={pathname === `/notes/${note.id}`}
            >
              <FileIcon />
              <div className="ml-2 truncate group-hover/button:mr-2">
                {note.title}
              </div>
              <div className="ml-auto flex items-center">
                <NoteDropdown side="right" align="start">
                  <HoverButton title="More...">
                    <MoreHorizontal />
                  </HoverButton>
                </NoteDropdown>
              </div>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

function NoteDropdown({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent {...props}>
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
          <DropdownMenuItem>
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
  );
}
