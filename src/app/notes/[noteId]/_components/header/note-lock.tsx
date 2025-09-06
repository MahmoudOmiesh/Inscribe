import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LockKeyholeIcon } from "lucide-react";
import { useNoteEditor } from "../note-editor-context";
import { useNoteMutations } from "../../mutations";

export function NoteLock() {
  const { note } = useNoteEditor();

  const { updateLocked } = useNoteMutations(note.id);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="hover:bg-accent/50 text-muted-foreground flex cursor-pointer flex-row items-center gap-1 rounded-md px-2 py-1"
          onClick={() => updateLocked.mutate(false)}
        >
          <LockKeyholeIcon size={16} />
          <span className="text-muted-foreground">Locked</span>
        </div>
      </TooltipTrigger>
      <TooltipContent
        variant="muted"
        arrow={false}
        side="bottom"
        sideOffset={8}
      >
        <p>This note is locked.</p>
        <p className="text-muted-foreground text-[10px]">Click to unlock.</p>
      </TooltipContent>
    </Tooltip>
  );
}
