import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { NotesSidebarHeader } from "./notes-sidebar-header";
import { NotesSidebarSections } from "./notes-sidebar-sections";
import { NotesSidebarSearch } from "./notes-sidebar-search";

export function NotesSidebar() {
  return (
    <Sidebar>
      <NotesSidebarHeader />

      <NotesSidebarSearch />

      <SidebarContent>
        <NotesSidebarSections />
      </SidebarContent>
    </Sidebar>
  );
}
