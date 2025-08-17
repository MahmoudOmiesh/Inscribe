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
  SidebarMenu,
} from "@/components/ui/sidebar";
import { api, HydrateClient } from "@/trpc/server";
import { PlusIcon } from "lucide-react";
import { FolderSortingButton, FolderSortingProvider } from "./folder-sorting";
import { FolderCreateDialog } from "./folder-dialogs";
import { FoldersList } from "./folder-list";
import { ErrorSuspenseBoundary } from "@/components/error-suspense-boundary";

export function NotesSidebarFolders() {
  void api.user.getFolders.prefetch();

  return (
    <HydrateClient>
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
                <SidebarMenu>
                  <ErrorSuspenseBoundary>
                    <FoldersList />
                  </ErrorSuspenseBoundary>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </FolderSortingProvider>
    </HydrateClient>
  );
}
