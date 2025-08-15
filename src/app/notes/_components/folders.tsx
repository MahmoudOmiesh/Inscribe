"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  folderInsertSchema,
  type Folder,
  type FolderInsert,
} from "@/lib/schema/folder";
import { api } from "@/trpc/react";
import {
  AlertTriangle,
  Archive,
  ChevronRight,
  Copy,
  CornerUpRight,
  ExternalLink,
  FolderPenIcon,
  GripVerticalIcon,
  Link,
  MoreHorizontal,
  Plus,
  StarIcon,
  Trash2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Spinner } from "@/components/spinner";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverGroup,
  PopoverItem,
  PopoverTrigger,
  PopoverContent,
  PopoverSeparator,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
  EmojiPickerFooter,
} from "@/components/ui/emoji-picker";
import { Input } from "@/components/ui/input";
import * as Sortable from "@/components/ui/sortable";

export function FoldersList() {
  const [isSorting, setIsSorting] = useState(true);
  const [folders] = api.user.getFolders.useSuspenseQuery();

  return (
    <>
      {isSorting ? (
        <FolderSortable folders={folders} setIsSorting={setIsSorting} />
      ) : folders.length === 0 ? (
        <div className="flex h-16 items-center justify-center p-2">
          <p className="text-muted-foreground text-center text-sm italic">
            No folders found.{" "}
            {
              <FolderCreateDialog>
                <span className="text-blue-500 hover:underline">
                  Create a new folder
                </span>
              </FolderCreateDialog>
            }
          </p>
        </div>
      ) : (
        folders.map((folder) => <FolderItem key={folder.id} folder={folder} />)
      )}
    </>
  );
}

function FolderSortable({
  folders,
  setIsSorting,
}: {
  folders: Folder[];
  setIsSorting: (isSorting: boolean) => void;
}) {
  const [editedFolders, setEditedFolders] = useState(folders);

  const utils = api.useUtils();
  const reorderFolders = api.folder.reorder.useMutation({
    onSuccess: async () => {
      await utils.user.getFolders.invalidate();
      setIsSorting(false);
    },
  });

  return (
    <>
      <Sortable.Root
        value={editedFolders}
        onValueChange={setEditedFolders}
        getItemValue={(item) => item.id}
        orientation="vertical"
      >
        <Sortable.Content className="flex flex-col gap-2">
          {editedFolders.map((folder) => (
            <Sortable.Item key={folder.id} value={folder.id} asChild asHandle>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                <GripVerticalIcon />
                {folder.name}
              </Button>
            </Sortable.Item>
          ))}
        </Sortable.Content>
        <Sortable.Overlay>
          <div className="bg-accent dark:bg-accent/50 size-full rounded-md" />
        </Sortable.Overlay>
      </Sortable.Root>
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start"
        disabled={reorderFolders.isPending}
        onClick={() =>
          reorderFolders.mutate(
            editedFolders.map((folder, index) => ({
              id: folder.id,
              order: index + 1,
            })),
          )
        }
      >
        Save Changes
        {reorderFolders.isPending && <Spinner />}
      </Button>
    </>
  );
}

export function FolderCreateDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const utils = api.useUtils();
  const createFolder = api.folder.create.useMutation({
    onSuccess: async () => {
      await utils.user.getFolders.invalidate();
      setIsDialogOpen(false);
    },
  });

  function handleSubmit(data: FolderInsert) {
    createFolder.mutate(data);
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a Folder</DialogTitle>
          </DialogHeader>
          <FolderForm
            isPending={createFolder.isPending}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

function FolderRenameDialog({
  folder,
  children,
}: {
  folder: Folder;
  children: React.ReactNode;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const utils = api.useUtils();
  const updateFolder = api.folder.update.useMutation({
    onSuccess: async () => {
      await utils.user.getFolders.invalidate();
      setIsDialogOpen(false);
    },
  });

  function handleSubmit(data: FolderInsert) {
    updateFolder.mutate({
      id: folder.id,
      ...data,
    });
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Folder</DialogTitle>
        </DialogHeader>
        <FolderForm
          isPending={updateFolder.isPending}
          onSubmit={handleSubmit}
          defaultValues={{ name: folder.name, emoji: folder.emoji }}
          isEdit
        />
      </DialogContent>
    </Dialog>
  );
}

function FolderDeleteDialog({
  folderId,
  children,
}: {
  folderId: number;
  children: React.ReactNode;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const utils = api.useUtils();
  const deleteFolder = api.folder.delete.useMutation({
    onSuccess: async () => {
      await utils.user.getFolders.invalidate();
      setIsDialogOpen(false);
    },
  });

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            folder and all its contents.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => deleteFolder.mutate({ id: folderId })}
            disabled={deleteFolder.isPending}
          >
            Delete
            {deleteFolder.isPending && <Spinner />}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function FolderForm({
  defaultValues,
  onSubmit,
  isPending,
  isEdit = false,
}: {
  onSubmit: (data: FolderInsert) => void;
  isPending: boolean;
  defaultValues?: FolderInsert;
  isEdit?: boolean;
}) {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const form = useForm<FolderInsert>({
    resolver: zodResolver(folderInsertSchema),
    defaultValues: defaultValues ?? {
      emoji: "📄",
      name: "",
    },
  });

  const emoji = form.watch("emoji");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Folder Name</FormLabel>
                  <div className="flex items-stretch gap-2">
                    <Popover
                      open={isEmojiPickerOpen}
                      onOpenChange={setIsEmojiPickerOpen}
                      modal={true}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setIsEmojiPickerOpen(true)}
                        >
                          {emoji}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-fit p-0"
                        side="top"
                        align="start"
                      >
                        <EmojiPicker
                          className="h-[342px]"
                          onEmojiSelect={({ emoji }) => {
                            form.setValue("emoji", emoji);
                            setIsEmojiPickerOpen(false);
                          }}
                        >
                          <EmojiPickerSearch />
                          <EmojiPickerContent />
                          <EmojiPickerFooter />
                        </EmojiPicker>
                      </PopoverContent>
                    </Popover>
                    <FormControl>
                      <Input
                        placeholder="Enter Folder Name"
                        {...field}
                        className="w-full flex-1"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-x-2 self-end">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit" disabled={isPending}>
              {isEdit ? "Update" : "Create"}
              {isPending && <Spinner />}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

function FolderItem({ folder }: { folder: Folder }) {
  return (
    <Collapsible>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="group/collapsible">
            <span>
              {folder.emoji} {folder.name}
            </span>
            <ChevronRight className="ml-auto hidden transition-transform group-hover/collapsible:block group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <Popover>
          <PopoverTrigger asChild>
            <SidebarMenuAction showOnHover>
              <MoreHorizontal />
            </SidebarMenuAction>
          </PopoverTrigger>
          <PopoverContent align="center" side="right" className="w-fit">
            <PopoverGroup>
              <PopoverItem>
                <Plus /> Add Note
              </PopoverItem>
              <FolderRenameDialog folder={folder}>
                <PopoverItem>
                  <FolderPenIcon /> Rename Folder
                </PopoverItem>
              </FolderRenameDialog>
            </PopoverGroup>
            <PopoverSeparator />
            <PopoverGroup>
              <FolderDeleteDialog folderId={folder.id}>
                <PopoverItem>
                  <Trash2 className="text-destructive" /> Delete Permanently
                </PopoverItem>
              </FolderDeleteDialog>
            </PopoverGroup>
          </PopoverContent>
        </Popover>
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
  );
}
