import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  CornerUpRightIcon,
  CopyIcon,
  LinkIcon,
  MoreVerticalIcon,
  Trash2Icon,
  AArrowDown,
  Maximize2Icon,
  LockKeyholeOpenIcon,
  Undo2Icon,
  Redo2Icon,
  ArrowRightFromLineIcon,
} from "lucide-react";

export function NoteHeaderDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVerticalIcon className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="shadow-sm">
        <DropdownMenuGroup className="grid grid-cols-3 gap-2">
          <DropdownMenuItem className="flex flex-col items-center gap-1">
            <span className="text-xl font-semibold">Aa</span>
            <span className="text-muted-foreground text-xs">Default</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-center gap-1">
            <span className="font-serif text-xl font-semibold">Aa</span>
            <span className="text-muted-foreground text-xs">Serif</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-center gap-1">
            <span className="font-mono text-xl font-semibold">Aa</span>
            <span className="text-muted-foreground text-xs">Mono</span>
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
            <Trash2Icon /> Move to Trash
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <AArrowDown /> Small text <Switch className="ml-auto" />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Maximize2Icon className="rotate-45" /> Full width{" "}
            <Switch className="ml-auto" />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LockKeyholeOpenIcon /> Lock page <Switch className="ml-auto" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Undo2Icon /> Undo
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Redo2Icon /> Redo
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <ArrowRightFromLineIcon className="-rotate-90" /> Export
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
