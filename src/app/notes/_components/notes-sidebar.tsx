import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NotesSidebarHeader } from "./notes-sidebar-header";
import { ArchiveIcon, SearchIcon, TrashIcon } from "lucide-react";
import { NotesSidebarFavorites } from "./notes-sidebar-favorites";
import { NotesSidebarFolders } from "./folders/notes-sidebar-folders";

export async function NotesSidebar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isAnonymous = session == null;

  return (
    <Sidebar>
      <NotesSidebarHeader
        isAnonymous={isAnonymous}
        name={session?.user.name ?? ""}
        email={session?.user.email ?? ""}
        photoUrl={session?.user.image ?? ""}
      />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <SearchIcon /> Search
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <TrashIcon /> Trash
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <ArchiveIcon /> Archive
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <NotesSidebarFavorites />

        <NotesSidebarFolders />
      </SidebarContent>
    </Sidebar>
  );
}
