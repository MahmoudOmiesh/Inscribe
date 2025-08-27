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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/spinner";
import { FolderInsertSchema, type FolderInsert } from "@/lib/schema/folder";
import type { LocalFolder } from "@/local/schema/folder";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import {
  createLocalFolder,
  deleteLocalFolder,
  updateLocalFolder,
} from "@/local/mutations/folders";
import { useMutation } from "@tanstack/react-query";
import { useUserId } from "../user-context";

export function FolderCreateDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const userId = useUserId();

  const createFolder = useMutation({
    mutationFn: createLocalFolder,
    onMutate: () => setIsDialogOpen(false),
    meta: {
      toastOnError: "Failed to create folder. Please try again.",
    },
  });

  function handleSubmit(data: FolderInsert) {
    createFolder.mutate({
      userId,
      data,
    });
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Folder</DialogTitle>
        </DialogHeader>
        <FolderForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}

export function FolderRenameDialog({
  folder,
  children,
}: {
  folder: LocalFolder;
  children: React.ReactNode;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const userId = useUserId();

  const updateFolder = useMutation({
    mutationFn: updateLocalFolder,
    onMutate: () => setIsDialogOpen(false),
    meta: {
      toastOnError: "Failed to rename folder. Please try again.",
    },
  });

  function handleSubmit(data: FolderInsert) {
    updateFolder.mutate({
      folderId: folder.id,
      userId,
      data,
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
          onSubmit={handleSubmit}
          defaultValues={{ name: folder.name, emoji: folder.emoji }}
          isEdit
        />
      </DialogContent>
    </Dialog>
  );
}

export function FolderDeleteDialog({
  folderId,
  children,
}: {
  folderId: string;
  children: React.ReactNode;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const userId = useUserId();

  const deleteFolder = useMutation({
    mutationFn: deleteLocalFolder,
    onMutate: () => setIsDialogOpen(false),
    meta: {
      toastOnError: "Failed to delete folder. Please try again.",
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
            onClick={() => deleteFolder.mutate({ folderId, userId })}
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
  isEdit = false,
}: {
  onSubmit: (data: FolderInsert) => void;
  defaultValues?: FolderInsert;
  isEdit?: boolean;
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

            <Button type="submit">{isEdit ? "Update" : "Create"}</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
