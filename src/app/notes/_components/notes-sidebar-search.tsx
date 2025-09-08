"use client";

import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useDelayedVisible } from "@/hooks/use-delayed-visible";
import { useLocalNotesSearch } from "@/local/queries/notes";
import type { LocalNote } from "@/local/schema/note";
import { cn } from "@/lib/utils";
import { FileIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function NotesSidebarSearch() {
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchDialogOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                variant="outline"
                onClick={() => setIsSearchDialogOpen(true)}
                className="transition-colors"
              >
                <SearchIcon /> Search
                <span
                  className={
                    "bg-muted text-muted-foreground ml-auto rounded-sm p-1 text-xs tracking-widest"
                  }
                >
                  ⌘K
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SearchDialog
        isOpen={isSearchDialogOpen}
        onOpenChange={setIsSearchDialogOpen}
      />
    </>
  );
}

function SearchDialog({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex min-h-[40vh] flex-col gap-4 sm:max-w-xl">
        <SearchDialogContent closeDialog={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function SearchDialogContent({ closeDialog }: { closeDialog: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const notes = useLocalNotesSearch(searchQuery);

  const debouncedSetSearchQuery = useDebouncedCallback(setSearchQuery, 300);
  const showLoading = useDelayedVisible(!notes);

  const [activeNodeIdx, setActiveNodeIdx] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setActiveNodeIdx((prev) =>
      Math.max(0, Math.min(prev, (notes?.length ?? 1) - 1)),
    );
  }, [notes]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        setActiveNodeIdx((prev) =>
          Math.min(prev + 1, (notes?.length ?? 1) - 1),
        );
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        setActiveNodeIdx((prev) => Math.max(prev - 1, 0));
        break;
      }
      case "Enter": {
        e.preventDefault();
        if (notes?.[activeNodeIdx]) {
          router.push(`/notes/${notes[activeNodeIdx].id}`);
          closeDialog();
        }
        break;
      }
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Search</DialogTitle>
      </DialogHeader>
      <div className="focus-within:border-primary flex cursor-text items-center gap-2 rounded-md border p-2">
        <SearchIcon className="text-muted-foreground size-4" />
        <Input
          autoFocus
          placeholder="Search your notes..."
          className="h-fit rounded-none border-none bg-transparent p-0 text-sm shadow-none focus-visible:shadow-none focus-visible:ring-0 dark:bg-transparent"
          onChange={(e) => debouncedSetSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <ScrollArea className="h-[30vh]">
        <div className="space-y-3 pr-3">
          {searchQuery === "" ? (
            <SearchDialogState type="no-search" />
          ) : !notes ? (
            showLoading ? (
              <SearchDialogState type="loading" />
            ) : null
          ) : notes.length === 0 ? (
            <SearchDialogState type="empty" />
          ) : (
            notes.map((note, idx) => (
              <SearchDialogNote
                key={note.id}
                note={note}
                isActive={idx === activeNodeIdx}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </>
  );
}

function SearchDialogNote({
  note,
  isActive = false,
}: {
  note: LocalNote;
  isActive?: boolean;
}) {
  return (
    <Link href={`/notes/${note.id}`} className="block">
      <div
        className={cn(
          "hover:bg-muted flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm",
          isActive && "bg-muted border-primary",
        )}
      >
        <FileIcon className="size-4" />
        <div className="truncate">{note.title}</div>
      </div>
    </Link>
  );
}

function SearchDialogState({
  type,
}: {
  type: "loading" | "empty" | "no-search";
}) {
  switch (type) {
    case "loading":
      return Array.from({ length: 5 }).map((_, index) => (
        <div key={index}>
          <Skeleton className="h-10 w-full" />
        </div>
      ));
    case "empty":
    case "no-search":
      return (
        <div className="text-muted-foreground flex flex-col items-center gap-2 py-6 text-sm">
          <div className="bg-muted text-muted-foreground grid place-items-center rounded-full p-2">
            {type === "empty" ? (
              <FileIcon className="size-6" />
            ) : (
              <SearchIcon className="size-6" />
            )}
          </div>
          <span>
            {type === "empty" ? "No notes found" : "You haven't searched yet"}
          </span>
        </div>
      );
  }
}
