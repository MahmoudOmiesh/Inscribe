import { Button } from "@/components/ui/button";
import { useNoteEditor } from "../note-editor-context";
import { Trash2Icon, Undo2Icon } from "lucide-react";
import { useNoteMutations } from "../../mutations";

export function NoteBanner() {
  const { note } = useNoteEditor();
  const { restoreNote, deleteNote, updateArchive } = useNoteMutations(note.id);

  if (note.isTrashed) {
    return (
      <div className="bg-destructive flex flex-col items-center justify-center gap-3 px-5 py-2 text-center md:flex-row md:gap-6">
        <p className="text-sm">You moved this note to trash</p>
        <div className="flex flex-row items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-white bg-transparent hover:bg-white/[0.01] dark:border-white dark:bg-transparent dark:hover:bg-white/[0.01]"
            onClick={() => restoreNote.mutate()}
          >
            <Undo2Icon /> Restore note
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-white bg-transparent hover:bg-white/[0.01] dark:border-white dark:bg-transparent dark:hover:bg-white/[0.01]"
            onClick={() => deleteNote.mutate()}
          >
            <Trash2Icon /> Delete permanently
          </Button>
        </div>
      </div>
    );
  }

  if (note.isArchived) {
    return (
      <div className="bg-muted flex flex-col items-center justify-center gap-3 px-5 py-2 text-center md:flex-row md:gap-6">
        <p className="text-sm">You archived this note</p>
        <Button
          variant="outline"
          size="sm"
          className="border-white bg-transparent hover:bg-white/[0.01] dark:border-white dark:bg-transparent dark:hover:bg-white/[0.01]"
          onClick={() => updateArchive.mutate(false)}
        >
          <Undo2Icon /> Unarchive note
        </Button>
      </div>
    );
  }

  return null;
}
