"use client";

import { Button, buttonVariants } from "@/components/ui/button";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  AlertTriangleIcon,
  ArchiveIcon,
  ChevronRight,
  CopyIcon,
  CornerUpRightIcon,
  ExternalLinkIcon,
  FileIcon,
  FolderPenIcon,
  LinkIcon,
  MoreHorizontal,
  PlusIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react";
import { FolderForm } from "./folders/folder-dialogs";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";

const fakeNotes = [
  {
    id: "1",
    name: "Note 1",
  },
  {
    id: "2",
    name: "Note 2",
  },
  {
    id: "3",
    name: "Note 3",
  },
];

function HoverButton({
  children,
  onClick,
  className,
  title,
  ...props
}: React.ComponentProps<"div"> & {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const button = (
    <div
      role="button"
      className={cn(
        buttonVariants({
          variant: "ghost",
          size: "icon",
        }),
        "size-5 rounded-sm opacity-0 transition-opacity duration-100 group-hover/button:opacity-100 group-focus-visible/button:opacity-100 focus:opacity-100 dark:hover:bg-gray-100/10",
        className,
      )}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      tabIndex={0}
      {...props}
    >
      {children}
    </div>
  );

  if (!title) {
    return button;
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={150}>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="bottom"
          variant="muted"
          arrow={false}
          sideOffset={8}
          className="rounded-sm px-2 py-1.5"
        >
          {title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function NotesSidebarFolders() {
  return (
    <Collapsible defaultOpen>
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="group/button justify-start">
              Folders
              <div className="ml-auto flex items-center">
                <FolderCreateDropdown
                  side="bottom"
                  align="center"
                  alignOffset={10}
                >
                  <HoverButton title="Add Folder">
                    <PlusIcon />
                  </HoverButton>
                </FolderCreateDropdown>
              </div>
            </Button>
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="group/button relative gap-0 hover:pr-10 focus-visible:pr-10">
                      <div className="flex size-4 items-center justify-center">
                        <span className="group-hover/button:hidden group-focus-visible/button:hidden">
                          🎨
                        </span>
                        <ChevronRight className="text-primary hidden transition-transform group-hover/button:block group-focus-visible/button:block group-data-[state=open]/button:rotate-90" />
                      </div>
                      <div className="ml-2 truncate group-hover/button:mr-2 group-focus-visible/button:mr-2">
                        Folder Name long long long long long long{" "}
                      </div>
                      <div className="absolute top-1/2 right-1 flex -translate-y-1/2 items-center gap-1 opacity-0 transition-opacity duration-100 group-hover/button:opacity-100">
                        <FolderMoreDropdown side="right" align="start">
                          <HoverButton title="More...">
                            <MoreHorizontal />
                          </HoverButton>
                        </FolderMoreDropdown>
                        <HoverButton title="Add Note">
                          <PlusIcon />
                        </HoverButton>
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenu>
                      {fakeNotes.map((note) => (
                        <SidebarMenuItem key={note.id}>
                          <SidebarMenuButton className="group/button h-fit gap-0 py-1.5 pl-8">
                            <FileIcon />
                            <div className="ml-2 truncate group-hover/button:mr-2">
                              {note.name}
                            </div>
                            <div className="ml-auto flex items-center">
                              <NoteCreateDropdown side="right" align="start">
                                <HoverButton title="More...">
                                  <MoreHorizontal />
                                </HoverButton>
                              </NoteCreateDropdown>
                            </div>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

function FolderCreateDropdown({
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent> & {
  children: React.ReactNode;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent {...props} onClick={(e) => e.stopPropagation()}>
        <FolderForm onSubmit={() => {}} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FolderMoreDropdown({
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent> & {
  children: React.ReactNode;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (!isDialogOpen) {
      setTimeout(() => setIsFormOpen(false), 200);
    }
  }, [isDialogOpen]);

  return (
    <DropdownMenu open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        {...props}
        onClick={(e) => e.stopPropagation()}
        className="min-w-[200px]"
      >
        {isFormOpen ? (
          <FolderForm onSubmit={() => {}} />
        ) : (
          <>
            <DropdownMenuLabel className="text-muted-foreground pt-1 text-xs font-medium">
              Folder
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                setIsFormOpen(true);
              }}
            >
              <FolderPenIcon /> Rename Folder
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive-hover">
              <Trash2Icon /> Delete Permanently
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NoteCreateDropdown({
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent> & {
  children: React.ReactNode;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        {...props}
        onClick={(e) => e.stopPropagation()}
        className="min-w-[200px]"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <StarIcon /> Add to Favorites
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ArchiveIcon /> Archive Note
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <LinkIcon /> Copy Link
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CopyIcon /> Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CornerUpRightIcon /> Move To
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Trash2Icon /> Move to Trash
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <ExternalLinkIcon />
            Open in New Tab
          </DropdownMenuItem>
          <DropdownMenuItem>
            <AlertTriangleIcon className="text-destructive" />
            Delete Permanently
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FolderEmptyState() {
  return (
    <div className="text-center">
      <p className="text-muted-foreground text-sm">You have no folders yet</p>
      <FolderCreateDropdown>
        <Button variant="link" size="sm" className="h-fit">
          Create a new folder
        </Button>
      </FolderCreateDropdown>
    </div>
  );
}
