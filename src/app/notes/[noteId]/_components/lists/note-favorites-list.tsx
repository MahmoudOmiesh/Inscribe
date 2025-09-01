"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocalNoteFavorites } from "@/local/queries/notes";
import { usePathname } from "next/navigation";
import { NoteEmptyState, NoteLoadingState } from "./states";
import { FileIcon, MoreHorizontal } from "lucide-react";
import { NoteDropdown } from "./note-dropdown";
import { HoverButton } from "@/components/hover-button";
import Link from "next/link";
import { useDelayedVisible } from "@/hooks/use-delayed-visible";

export function NoteFavoritesList() {
  const favorites = useLocalNoteFavorites();
  const pathname = usePathname();

  const showLoading = useDelayedVisible(!favorites);

  if (!favorites) {
    return showLoading ? <NoteLoadingState /> : null;
  }

  const isEmpty = favorites.length === 0;

  return (
    <SidebarMenu>
      {isEmpty && <NoteEmptyState label="No favorites found" />}
      {favorites.map((favorite) => (
        <SidebarMenuItem key={favorite.id}>
          <Link href={`/notes/${favorite.id}`}>
            <SidebarMenuButton
              className="group/button h-fit gap-0 py-1.5"
              isActive={pathname === `/notes/${favorite.id}`}
            >
              <FileIcon />
              <div className="ml-2 truncate group-hover/button:mr-2">
                {favorite.title}
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
