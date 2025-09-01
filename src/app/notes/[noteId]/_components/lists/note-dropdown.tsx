"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
} from "lucide-react";

export function NoteDropdown({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent {...props}>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <StarIcon /> Add to favorites
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ArchiveIcon /> Archive note
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <LinkIcon /> Copy link
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CopyIcon /> Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CornerUpRightIcon /> Move to
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Trash2Icon /> Move to trash
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <ExternalLinkIcon />
            Open in new tab
          </DropdownMenuItem>
          <DropdownMenuItem>
            <AlertTriangleIcon className="text-destructive" />
            Delete permanently
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function NoteArchiveDropdown({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent {...props}>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <LinkIcon /> Copy link
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CopyIcon /> Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Undo2Icon /> Unarchive
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <ExternalLinkIcon />
            Open in new tab
          </DropdownMenuItem>
          <DropdownMenuItem>
            <AlertTriangleIcon className="text-destructive" />
            Delete permanently
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function NoteTrashDropdown({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent {...props}>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Undo2Icon /> Restore note
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <AlertTriangleIcon className="text-destructive" />
            Delete permanently
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>{" "}
    </DropdownMenu>
  );
}
