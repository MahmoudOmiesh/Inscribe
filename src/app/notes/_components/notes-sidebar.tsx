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
import { NotesSidebarHeader } from "./notes-sidebar-header";
import { NotesSidebarSections } from "./notes-sidebar-sections";

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

        <NotesSidebarSections />
      </SidebarContent>
    </Sidebar>
  );
}
