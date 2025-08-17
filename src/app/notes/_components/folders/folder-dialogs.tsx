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
import {
  folderInsertSchema,
  type Folder,
  type FolderInsert,
} from "@/lib/schema/folder";
import { api } from "@/trpc/react";
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

export function FolderCreateDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const utils = api.useUtils();
  const createFolder = api.folder.create.useMutation({
    meta: {
      invalidateQueries: () => utils.user.getFolders.invalidate(),
    },
    onSettled: () => {
      setIsDialogOpen(false);
    },
  });

  function handleSubmit(data: FolderInsert) {
    createFolder.mutate(data);
  }

  return (
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
  );
}

export function FolderRenameDialog({
  folder,
  children,
}: {
  folder: Folder;
  children: React.ReactNode;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const utils = api.useUtils();
  const updateFolder = api.folder.update.useMutation({
    meta: {
      invalidateQueries: () => utils.user.getFolders.invalidate(),
    },
    onSettled: () => {
      setIsDialogOpen(false);
    },
  });

  function handleSubmit(data: FolderInsert) {
    updateFolder.mutate({
      folderId: folder.id,
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

export function FolderDeleteDialog({
  folderId,
  children,
}: {
  folderId: number;
  children: React.ReactNode;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const utils = api.useUtils();
  const deleteFolder = api.folder.delete.useMutation({
    meta: {
      invalidateQueries: () => utils.user.getFolders.invalidate(),
    },
    onSettled: () => {
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
            onClick={() => deleteFolder.mutate({ folderId: folderId })}
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
