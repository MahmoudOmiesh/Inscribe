"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@/components/ui/emoji-picker";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FolderInsertSchema, type FolderInsert } from "@/lib/schema/folder";
import {
  deleteLocalFolder,
  updateLocalFolder,
} from "@/local/mutations/folders";
import type { LocalFolder } from "@/local/schema/folder";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { FolderPenIcon, SaveIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { useUserId } from "../../user-context";
import { useForm } from "react-hook-form";

export function FolderMoreDropdown({
  folder,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent> & {
  folder: LocalFolder;
  children: React.ReactNode;
}) {
  const userId = useUserId();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const updateFolder = useMutation({
    mutationFn: updateLocalFolder,
    onMutate: () => setIsDropdownOpen(false),
    meta: {
      toastOnError: "Failed to rename folder. Please try again.",
    },
    networkMode: "always",
  });

  useEffect(() => {
    if (!isDropdownOpen) {
      setTimeout(() => setIsFormOpen(false), 200);
    }
  }, [isDropdownOpen]);

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent
          {...props}
          onClick={(e) => e.stopPropagation()}
          hidden={isDeleteDialogOpen}
          className="min-w-[200px]"
        >
          {isFormOpen ? (
            <FolderForm
              defaultValues={{ name: folder.name, emoji: folder.emoji }}
              onSubmit={(data) =>
                updateFolder.mutate({ folderId: folder.id, userId, data })
              }
            />
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
              <DropdownMenuItem
                variant="destructive-hover"
                onSelect={(e) => {
                  e.preventDefault();
                  setIsDeleteDialogOpen(true);
                  setIsDropdownOpen(false);
                }}
              >
                <Trash2Icon /> Delete Permanently
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <FolderDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        folderId={folder.id}
      />
    </>
  );
}

export function FolderDeleteDialog({
  open,
  onOpenChange,
  folderId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId: string;
}) {
  const userId = useUserId();

  const deleteFolder = useMutation({
    mutationFn: deleteLocalFolder,
    onMutate: () => onOpenChange(false),
    meta: {
      toastOnError: "Failed to delete folder. Please try again.",
    },
    networkMode: "always",
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
            onClick={() => deleteFolder.mutate({ folderId, userId })}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function FolderForm({
  defaultValues,
  onSubmit,
}: {
  onSubmit: (data: FolderInsert) => void;
  defaultValues?: FolderInsert;
}) {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const form = useForm<FolderInsert>({
    resolver: zodResolver(FolderInsertSchema),
    defaultValues: defaultValues ?? {
      emoji: "📄",
      name: "",
    },
  });

  const emoji = form.watch("emoji");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex gap-2">
          <div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Folder Name</FormLabel>
                  <div className="flex items-stretch gap-1">
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
                          className="size-8 rounded-xs"
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
                        autoFocus
                        className="focus-visible:border-border h-auto w-full flex-1 rounded-xs focus-visible:ring-0"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" size="icon" className="size-8 rounded-xs">
            <SaveIcon />
          </Button>
        </div>
      </form>
    </Form>
  );
}
