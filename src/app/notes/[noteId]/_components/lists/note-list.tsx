"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { FileIcon, MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLocalFolderNotes } from "@/local/queries/folders";
import { HoverButton } from "@/components/hover-button";
import Link from "next/link";
import { NoteEmptyState, NoteLoadingState } from "./states";
import { NoteDropdown } from "./note-dropdown";
import { useDelayedVisible } from "@/hooks/use-delayed-visible";

export function NoteList({ folderId }: { folderId: string }) {
  const pathname = usePathname();
  const notes = useLocalFolderNotes(folderId);

  const showLoading = useDelayedVisible(!notes);

  if (!notes) {
    return showLoading ? <NoteLoadingState /> : null;
  }

  const isEmpty = notes.length === 0;

  return (
    <SidebarMenu>
      {isEmpty && <NoteEmptyState label="This folder is empty" />}
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
