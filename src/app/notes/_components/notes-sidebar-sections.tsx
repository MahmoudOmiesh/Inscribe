"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { FileIcon, StarIcon, ArchiveIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { NotesSidebarFolders } from "./sections/folders/notes-sidebar-folders";
import { NotesSidebarFavorites } from "./sections/notes-sidebar-favorites";
import { NotesSidebarTrash } from "./sections/notes-sidebar-trash";
import { NotesSidebarArchive } from "./sections/notes-siderbar-archive";

const SIDERBAR_SECTIONS = [
  {
    code: "all_notes" as const,
    label: "All Notes",
    icon: <FileIcon />,
    component: <NotesSidebarFolders />,
  },
  {
    code: "favorites" as const,
    label: "Favorites",
    icon: <StarIcon />,
    component: <NotesSidebarFavorites />,
  },
  {
    code: "archive" as const,
    label: "Archive",
    icon: <ArchiveIcon />,
    component: <NotesSidebarArchive />,
  },
  {
    code: "trash" as const,
    label: "Trash",
    icon: <Trash2Icon />,
    component: <NotesSidebarTrash />,
  },
];

type ActiveSectionCode = (typeof SIDERBAR_SECTIONS)[number]["code"];

export function NotesSidebarSections() {
  const [activeSection, setActiveSection] =
    useState<ActiveSectionCode>("all_notes");

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {SIDERBAR_SECTIONS.map((section) => (
              <SidebarMenuItem key={section.code}>
                <SidebarMenuButton
                  isActive={activeSection === section.code}
                  onClick={() => setActiveSection(section.code)}
                  className="data-[active=true]:font-normal"
                >
                  {section.icon} {section.label}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {
        SIDERBAR_SECTIONS.find((section) => section.code === activeSection)
          ?.component
      }
    </>
  );
}
