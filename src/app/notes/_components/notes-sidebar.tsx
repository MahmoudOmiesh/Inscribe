import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ArchiveIcon, SearchIcon, TrashIcon } from "lucide-react";
import { NotesSidebarFavorites } from "./notes-sidebar-favorites";
import { NotesSidebarFolders } from "./folders/notes-sidebar-folders";
import { NotesSidebarHeader } from "./notes-sidebar-header";

export async function NotesSidebar() {
  return (
    <Sidebar>
      <NotesSidebarHeader />
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
