import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
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
import { useNoteEditor } from "./note-editor-context";
import { NOTE_MUTATIONS } from "../mutations";
import { FONT_TYPES } from "@/text-editor/model/schema";

export function NoteHeaderDropdown() {
  const { note, editor } = useNoteEditor();

  const updateFont = NOTE_MUTATIONS.updateFont(note.id);
  const updateSmallText = NOTE_MUTATIONS.updateSmallText(note.id);
  const updateLocked = NOTE_MUTATIONS.updateLocked(note.id);
  const updateFullWidth = NOTE_MUTATIONS.updateFullWidth(note.id);

  const canUndoOrRedo = editor.canUndo || editor.canRedo;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVerticalIcon className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="shadow-sm">
        <DropdownMenuGroup className="grid grid-cols-3 gap-2">
          {FONT_TYPES.map((font) => (
            <DropdownMenuItem
              key={font}
              className="flex flex-col items-center gap-0"
              variant={note.font === font ? "primary" : "default"}
              onClick={(e) => {
                e.preventDefault();
                updateFont.mutate({ font, noteId: note.id });
              }}
            >
              <span className="text-xl font-semibold">Aa</span>
              <span className="text-xs">{font}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(window.location.href)}
          >
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
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              updateSmallText.mutate({
                smallText: !note.smallText,
                noteId: note.id,
              });
            }}
          >
            <AArrowDown /> Small text{" "}
            <Switch
              id="small-text"
              className="pointer-events-none ml-auto"
              checked={note.smallText}
            />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              updateFullWidth.mutate({
                fullWidth: !note.fullWidth,
                noteId: note.id,
              });
            }}
          >
            <Maximize2Icon className="rotate-45" /> Full width{" "}
            <Switch
              id="full-width"
              className="pointer-events-none ml-auto"
              checked={note.fullWidth}
            />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              updateLocked.mutate({ locked: !note.locked, noteId: note.id });
            }}
          >
            <LockKeyholeOpenIcon /> Lock page{" "}
            <Switch
              id="lock-page"
              className="pointer-events-none ml-auto"
              checked={note.locked}
            />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {canUndoOrRedo && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {editor.canUndo && (
                <DropdownMenuItem onClick={() => editor.undo()}>
                  <Undo2Icon /> Undo
                </DropdownMenuItem>
              )}
              {editor.canRedo && (
                <DropdownMenuItem onClick={() => editor.redo()}>
                  <Redo2Icon /> Redo
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </>
        )}
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
