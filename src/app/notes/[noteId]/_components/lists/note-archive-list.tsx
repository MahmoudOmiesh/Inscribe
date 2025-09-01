"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocalNoteArchive } from "@/local/queries/notes";
import { usePathname } from "next/navigation";
import { NoteEmptyState, NoteLoadingState } from "./states";
import { FileIcon, MoreHorizontal } from "lucide-react";
import { NoteArchiveDropdown } from "./note-dropdown";
import { HoverButton } from "@/components/hover-button";
import Link from "next/link";
import { useDelayedVisible } from "@/hooks/use-delayed-visible";

export function NoteArchiveList() {
  const archive = useLocalNoteArchive();
  const pathname = usePathname();

  const showLoading = useDelayedVisible(!archive);

  if (!archive) {
    return showLoading ? <NoteLoadingState /> : null;
  }

  const isEmpty = archive.length === 0;

  return (
    <SidebarMenu>
      {isEmpty && <NoteEmptyState label="No archive found" />}
      {archive.map((archive) => (
        <SidebarMenuItem key={archive.id}>
          <Link href={`/notes/${archive.id}`}>
            <SidebarMenuButton
              className="group/button h-fit gap-0 py-1.5"
              isActive={pathname === `/notes/${archive.id}`}
            >
              <FileIcon />
              <div className="ml-2 truncate group-hover/button:mr-2">
                {archive.title}
              </div>
              <div className="ml-auto flex items-center">
                <NoteArchiveDropdown
                  noteId={archive.id}
                  side="right"
                  align="start"
                >
                  <HoverButton title="More...">
                    <MoreHorizontal />
                  </HoverButton>
                </NoteArchiveDropdown>
              </div>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
