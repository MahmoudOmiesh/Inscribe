"use client";

import { ProfileDropdown } from "@/components/profile-dropdown";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  FileIcon,
  MoreVerticalIcon,
  Redo2Icon,
  StarIcon,
  Undo2Icon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { api } from "@/trpc/react";
import { MutationStatusIndicator } from "@/components/mutation-status-indicator";

export function NoteHeader({ noteId }: { noteId: number }) {
  const [note] = api.note.get.useSuspenseQuery({ noteId: noteId });
  const { data: session } = authClient.useSession();

  return (
    <header className="sticky top-0 flex flex-row items-center justify-between px-4 py-2 text-sm">
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-row items-center gap-1">
          <FileIcon size={16} />
          <span>{note.title}</span>
        </div>
        <MutationStatusIndicator />
      </div>
      <div className="flex flex-row items-center gap-2">
        <div>
          <Button variant="ghost" size="icon">
            <Undo2Icon className="text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon">
            <Redo2Icon className="text-muted-foreground" />
          </Button>
        </div>

        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4"
        />

        <div className="flex flex-row items-center">
          <Button variant="ghost" size="icon">
            <StarIcon className="text-muted-foreground" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVerticalIcon className="text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">hi</DropdownMenuContent>
          </DropdownMenu>
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
