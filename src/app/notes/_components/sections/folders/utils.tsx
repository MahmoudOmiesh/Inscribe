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
import { deleteLocalFolder } from "@/local/mutations/folders";
import type { LocalFolder } from "@/local/schema/folder";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { FolderPenIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { useUserId } from "../../user-context";
import { useForm } from "react-hook-form";
import { useClickOutside } from "@/hooks/use-click-outside";

export function FolderMoreDropdown({
  folder,
  children,
  onRename,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent> & {
  onRename: () => void;
  folder: LocalFolder;
  children: React.ReactNode;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // const updateFolder = useMutation({
  //   mutationFn: updateLocalFolder,
  //   onMutate: () => setIsDropdownOpen(false),
  //   meta: {
  //     toastOnError: "Failed to rename folder. Please try again.",
  //   },
  //   networkMode: "always",
  // });

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
          <DropdownMenuLabel className="text-muted-foreground pt-1 text-xs font-medium">
            Folder
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={onRename}>
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
  const formRef = useClickOutside<HTMLFormElement>((form) => {
    form.requestSubmit();
  });

  const { setFocus } = form;
  useEffect(() => {
    setFocus("name", {
      shouldSelect: true,
    });
  }, [setFocus]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} ref={formRef}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Folder Name</FormLabel>
              <div className="mb-0.5 flex items-center px-2 py-0.5">
                <Popover
                  open={isEmojiPickerOpen}
                  onOpenChange={setIsEmojiPickerOpen}
                  modal={true}
                >
                  <PopoverTrigger asChild>
                    <div className="flex size-4 cursor-pointer items-center justify-center transition-transform duration-100 hover:scale-110">
                      {emoji}
                    </div>
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
                    className="h-fit w-full flex-1 rounded-sm border-0 bg-transparent px-2 py-1 shadow-none focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
