import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { PlusIcon } from "lucide-react";
import { FolderSortingButton, FolderSortingProvider } from "./folder-sorting";
import { FolderCreateDialog } from "./folder-dialogs";
import { FoldersList } from "./folder-list";

export function NotesSidebarFolders() {
  return (
    <FolderSortingProvider>
      <Collapsible defaultOpen>
        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger className="hover:bg-accent/70 cursor-pointer">
              Folders
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <SidebarGroupAction className="right-10">
            <FolderSortingButton />
          </SidebarGroupAction>
          <SidebarGroupAction>
            <FolderCreateDialog>
              <PlusIcon />
            </FolderCreateDialog>
          </SidebarGroupAction>
          <CollapsibleContent>
            <SidebarGroupContent>
              <FoldersList />
            </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    </FolderSortingProvider>
  );
}
