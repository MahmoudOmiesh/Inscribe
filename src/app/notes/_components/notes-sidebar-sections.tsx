"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { FileIcon, StarIcon, ArchiveIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { NotesSidebarFolders } from "./folders/notes-sidebar-folders";

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
    component: <div>favorites</div>,
  },
  {
    code: "archive" as const,
    label: "Archive",
    icon: <ArchiveIcon />,
    component: <div>archive</div>,
  },
  {
    code: "trash" as const,
    label: "Trash",
    icon: <Trash2Icon />,
    component: <div>trash</div>,
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
                  className={cn(
                    activeSection === section.code &&
                      "inset-shadow-[-8px_0px_8px_-8px_var(--color-primary)]",
                  )}
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
