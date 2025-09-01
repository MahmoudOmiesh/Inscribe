"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocalNoteTrash } from "@/local/queries/notes";
import { usePathname } from "next/navigation";
import { NoteEmptyState, NoteLoadingState } from "./states";
import { FileIcon, MoreHorizontal } from "lucide-react";
import { NoteTrashDropdown } from "./note-dropdown";
import { HoverButton } from "@/components/hover-button";
import Link from "next/link";
import { useDelayedVisible } from "@/hooks/use-delayed-visible";

export function NoteTrashList() {
  const trash = useLocalNoteTrash();
  const pathname = usePathname();

  const showLoading = useDelayedVisible(!trash);

  if (!trash) {
    return showLoading ? <NoteLoadingState /> : null;
  }

  const isEmpty = trash.length === 0;

  return (
    <SidebarMenu>
      {isEmpty && <NoteEmptyState label="No trash found" />}
      {trash.map((trash) => (
        <SidebarMenuItem key={trash.id}>
          <Link href={`/notes/${trash.id}`}>
            <SidebarMenuButton
              className="group/button h-fit gap-0 py-1.5"
              isActive={pathname === `/notes/${trash.id}`}
            >
              <FileIcon />
              <div className="ml-2 truncate group-hover/button:mr-2">
                {trash.title}
              </div>
              <div className="ml-auto flex items-center">
                <NoteTrashDropdown noteId={trash.id} side="right" align="start">
                  <HoverButton title="More...">
                    <MoreHorizontal />
                  </HoverButton>
                </NoteTrashDropdown>
              </div>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
