"use client";

import { ProfileDropdown } from "@/components/profile-dropdown";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Redo2Icon, Undo2Icon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { MutationStatusIndicator } from "@/components/mutation-status-indicator";
import { NoteFavorite } from "./note-favorite";
import { useNoteEditor } from "../note-editor-context";
import { NoteHeaderDropdown } from "./note-header-dropdown";
import { NoteLock } from "./note-lock";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NoteHeaderDrawer } from "./note-header-drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIsOnline } from "@/hooks/use-is-online";
import { NoteOffline } from "./note-offline";
import { NoteBreadcrumb } from "./note-breadcrumb";

export function NoteHeader() {
  const { data: session } = authClient.useSession();

  const { note, editor } = useNoteEditor();

  const isMobile = useIsMobile();
  const isOffline = !useIsOnline();

  return (
    <header className="bg-background flex flex-row items-center justify-between px-4 py-3 text-sm sm:py-2">
      <div className="flex flex-row items-center gap-4">
        <SidebarTrigger />
        <NoteBreadcrumb />
        {note.locked && <NoteLock />}
        {isOffline && <NoteOffline />}
        <MutationStatusIndicator />
      </div>
      <div className="flex flex-row items-center gap-2">
        <div className="hidden md:block">
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
          className="hidden data-[orientation=vertical]:h-4 md:block"
        />

        <div className="flex flex-row items-center">
          {!isMobile && (
            <>
              <NoteFavorite />
              <NoteHeaderDropdown />
            </>
          )}
          {isMobile && <NoteHeaderDrawer />}
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
