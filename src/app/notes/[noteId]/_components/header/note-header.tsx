"use client";

import { ProfileDropdown } from "@/components/profile-dropdown";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileIcon, Redo2Icon, Undo2Icon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { MutationStatusIndicator } from "@/components/mutation-status-indicator";
import { NoteFavorite } from "./note-favorite";
import { useNoteEditor } from "../note-editor-context";
import { NoteHeaderDropdown } from "./note-header-dropdown";

export function NoteHeader() {
  const { data: session } = authClient.useSession();
  const { note, editor } = useNoteEditor();

  return (
    <header className="bg-background flex flex-row items-center justify-between px-4 py-2 text-sm">
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-row items-center gap-1">
          <FileIcon size={16} />
          <span className="max-w-[15em] truncate">{note.title}</span>
        </div>
        <MutationStatusIndicator />
      </div>
      <div className="flex flex-row items-center gap-2">
        <div>
          <Button
            variant="ghost"
            size="icon"
            disabled={!editor.canUndo}
            onClick={() => editor.undo()}
          >
            <Undo2Icon className="text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={!editor.canRedo}
            onClick={() => editor.redo()}
          >
            <Redo2Icon className="text-muted-foreground" />
          </Button>
        </div>

        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4"
        />

        <div className="flex flex-row items-center">
          <NoteFavorite />
          <NoteHeaderDropdown />
        </div>

        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4"
        />

        <ProfileDropdown
          name={session?.user?.name ?? ""}
          email={session?.user?.email ?? ""}
          photoUrl={session?.user?.image ?? ""}
          className="size-6"
        />
      </div>
    </header>
  );
}
