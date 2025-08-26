"use client";

import { Spinner } from "@/components/spinner";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocalNoteTrash } from "@/local/queries/notes";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NoteTrashList() {
  const trash = useLocalNoteTrash();
  const pathname = usePathname();

  if (!trash) {
    return (
      <div className="flex h-16 items-center justify-center p-2">
        <Spinner />
      </div>
    );
  }

  if (trash.length === 0) {
    return (
      <div className="flex h-8 items-center justify-center p-2">
        <p className="text-muted-foreground text-center text-sm italic">
          No trash notes found.
        </p>
      </div>
    );
  }

  return (
    <SidebarMenu>
      {trash.map((trash) => (
        <SidebarMenuItem key={trash.id}>
          <SidebarMenuButton
            asChild
            isActive={pathname === `/notes/${trash.id}`}
          >
            <Link href={`/notes/${trash.id}`}>{trash.title}</Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
