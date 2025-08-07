import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarMenuSubButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenu,
} from "@/components/ui/sidebar";
import {
  AlertTriangle,
  Archive,
  ChevronRight,
  Copy,
  CornerUpRight,
  ExternalLink,
  FolderPenIcon,
  Link,
  MoreHorizontal,
  Plus,
  PlusIcon,
  StarIcon,
  Trash2,
} from "lucide-react";

export function NotesSidebarFolders() {
  return (
    <Collapsible defaultOpen>
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger className="hover:bg-accent/70 cursor-pointer">
            Folders
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <SidebarGroupAction title="Add Folder">
          <PlusIcon className="size-4" />
          <span className="sr-only">Add Folder</span>
        </SidebarGroupAction>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="group/collapsible">
                      <span>💪 Fitness</span>
                      <ChevronRight className="ml-auto hidden transition-transform group-hover/collapsible:block group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <Plus /> Add Note
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FolderPenIcon /> Rename Folder
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <AlertTriangle className="text-destructive" />
                          Delete Permanently
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <CollapsibleContent>
                    <SidebarMenuSub className="mr-0 pr-[0.3rem]">
                      <SidebarMenuSubItem className="flex w-full items-center justify-between gap-2">
                        <SidebarMenuSubButton
                          tabIndex={0}
                          className="flex w-full items-center justify-between gap-2"
                        >
                          Push Day
                        </SidebarMenuSubButton>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              title="More"
                              variant="ghost"
                              size="icon"
                              className="size-5"
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuGroup>
                              <DropdownMenuItem>
                                <StarIcon /> Add to Favorites
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Archive /> Archive Note
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              <DropdownMenuItem>
                                <Link /> Copy Link
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy /> Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <CornerUpRight /> Move To
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Trash2 /> Move to Trash
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              <DropdownMenuItem>
                                <ExternalLink />
                                Open in New Tab
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <AlertTriangle className="text-destructive" />
                                Delete Permanently
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Plus /> Add New
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
