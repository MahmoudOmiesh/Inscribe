"use client";

import { Spinner } from "@/components/spinner";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocalNoteArchive } from "@/local/queries/notes";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NoteArchiveList() {
  const archive = useLocalNoteArchive();
  const pathname = usePathname();

  if (!archive) {
    return (
      <div className="flex h-16 items-center justify-center p-2">
        <Spinner />
      </div>
    );
  }

  if (archive.length === 0) {
    return (
      <div className="flex h-8 items-center justify-center p-2">
        <p className="text-muted-foreground text-center text-sm italic">
          No archived notes found.
        </p>
      </div>
    );
  }

  return (
    <SidebarMenu>
      {archive.map((archive) => (
        <SidebarMenuItem key={archive.id}>
          <SidebarMenuButton
            asChild
            isActive={pathname === `/notes/${archive.id}`}
          >
            <Link href={`/notes/${archive.id}`}>{archive.title}</Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
