"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import type { LocalNote } from "@/local/schema/note";
import {
  StarIcon,
  ArchiveIcon,
  LinkIcon,
  CopyIcon,
  CornerUpRightIcon,
  Trash2Icon,
  ExternalLinkIcon,
  AlertTriangleIcon,
  Undo2Icon,
  SearchIcon,
} from "lucide-react";
import { NOTE_MUTATIONS } from "../../mutations";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useLocalFolders } from "@/local/queries/folders";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/spinner";

export function NoteDropdown({
  note,
  children,
  ...props
}: {
  note: LocalNote;
  children: React.ReactNode;
} & React.ComponentProps<typeof DropdownMenuContent>) {
  const updateTrash = NOTE_MUTATIONS.updateTrash(note.id);
  const updateArchive = NOTE_MUTATIONS.updateArchive(note.id);
  const updateFavorite = NOTE_MUTATIONS.updateFavorite(note.id);
  const duplicateNote = NOTE_MUTATIONS.duplicateNote(note.id);
  const deleteNote = NOTE_MUTATIONS.deleteNote(note.id);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent {...props}>
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => updateFavorite.mutate(!note.isFavorite)}
          >
            <StarIcon
              className={cn(
                note.isFavorite && "fill-yellow-500 text-yellow-500",
              )}
            />{" "}
            {note.isFavorite ? "Remove from favorites" : "Add to favorites"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateArchive.mutate(true)}>
            <ArchiveIcon /> Archive note
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => copyNoteLink(note.id)}>
            <LinkIcon /> Copy link
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => duplicateNote.mutate()}>
            <CopyIcon /> Duplicate
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2">
              <CornerUpRightIcon className="text-muted-foreground size-4" />{" "}
              Move to
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent sideOffset={10}>
                <MoveToDropdown noteId={note.id} />
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem onClick={() => updateTrash.mutate(true)}>
            <Trash2Icon /> Move to trash
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => openNoteInNewTab(note.id)}>
            <ExternalLinkIcon />
            Open in new tab
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => deleteNote.mutate()}>
            <AlertTriangleIcon className="text-destructive" />
            Delete permanently
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function NoteArchiveDropdown({
  noteId,
  children,
  ...props
}: {
  noteId: string;
  children: React.ReactNode;
} & React.ComponentProps<typeof DropdownMenuContent>) {
  const updateArchive = NOTE_MUTATIONS.updateArchive(noteId);
  const deleteNote = NOTE_MUTATIONS.deleteNote(noteId);
  const duplicateNote = NOTE_MUTATIONS.duplicateNote(noteId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent {...props}>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => copyNoteLink(noteId)}>
            <LinkIcon /> Copy link
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => duplicateNote.mutate()}>
            <CopyIcon /> Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateArchive.mutate(false)}>
            <Undo2Icon /> Unarchive
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => openNoteInNewTab(noteId)}>
            <ExternalLinkIcon />
            Open in new tab
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => deleteNote.mutate()}>
            <AlertTriangleIcon className="text-destructive" />
            Delete permanently
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function NoteTrashDropdown({
  noteId,
  children,
  ...props
}: {
  noteId: string;
  children: React.ReactNode;
} & React.ComponentProps<typeof DropdownMenuContent>) {
  const restoreNote = NOTE_MUTATIONS.restoreNote(noteId);
  const deleteNote = NOTE_MUTATIONS.deleteNote(noteId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent {...props}>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => restoreNote.mutate()}>
            <Undo2Icon /> Restore note
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => deleteNote.mutate()}>
            <AlertTriangleIcon className="text-destructive" />
            Delete permanently
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>{" "}
    </DropdownMenu>
  );
}

function MoveToDropdown({ noteId }: { noteId: string }) {
  const [search, setSearch] = useState("");
  const folders = useLocalFolders();

  const updateFolder = NOTE_MUTATIONS.updateFolder(noteId);
  const filteredFolders =
    folders?.filter((folder) =>
      folder.name.toLowerCase().includes(search.toLowerCase()),
    ) ?? [];

  const isPending = folders === undefined;

  return (
    <div>
      <DropdownMenuGroup>
        <div className="focus-within:ring-ring focus-within:border-primary flex cursor-text items-center gap-2 rounded-sm border p-1">
          <SearchIcon className="text-muted-foreground size-4" />
          <Input
            placeholder="Move to..."
            className="h-fit rounded-none border-none bg-transparent p-0 text-xs shadow-none placeholder:text-xs focus-visible:shadow-none focus-visible:ring-0 dark:bg-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </DropdownMenuGroup>
      <DropdownMenuGroup className="mt-2">
        {isPending ? (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <>
            {filteredFolders.map((folder) => (
              <DropdownMenuItem
                key={folder.id}
                onClick={() => updateFolder.mutate(folder.id)}
              >
                {folder.emoji} {folder.name}
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuGroup>
    </div>
  );
}

function copyNoteLink(noteId: string) {
  const link = `${window.location.origin}/notes/${noteId}`;
  void navigator.clipboard.writeText(link);
}

function openNoteInNewTab(noteId: string) {
  const link = `${window.location.origin}/notes/${noteId}`;
  window.open(link, "_blank");
}
