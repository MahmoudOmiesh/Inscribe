import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SearchIcon } from "lucide-react";
import { NotesSidebarFavorites } from "./notes-sidebar-favorites";
import { NotesSidebarFolders } from "./folders/notes-sidebar-folders";
import { NotesSidebarHeader } from "./notes-sidebar-header";
import { NotesSidebarTrash } from "./notes-sidebar-trash";
import { NotesSidebarArchive } from "./notes-siderbar-archive";

export function NotesSidebar() {
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <NotesSidebarFavorites />

        <NotesSidebarFolders />

        <NotesSidebarArchive />

        <NotesSidebarTrash />
      </SidebarContent>
    </Sidebar>
  );
}
