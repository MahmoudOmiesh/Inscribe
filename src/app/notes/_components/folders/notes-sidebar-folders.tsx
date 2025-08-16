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
import { Suspense } from "react";
import { Spinner } from "@/components/spinner";
import { PlusIcon } from "lucide-react";
import { FolderSortingButton, FolderSortingProvider } from "./folder-sorting";
import { FolderCreateDialog } from "./folder-dialogs";
import { FoldersList } from "./folder-list";

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
                  <Suspense
                    fallback={
                      <div className="flex h-16 items-center justify-center p-2">
                        <Spinner />
                      </div>
                    }
                  >
                    <FoldersList />
                  </Suspense>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </FolderSortingProvider>
    </HydrateClient>
  );
}
