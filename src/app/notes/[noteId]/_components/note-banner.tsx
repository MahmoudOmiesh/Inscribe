import { Button } from "@/components/ui/button";
import { useNoteEditor } from "./note-editor-context";
import { Trash2Icon, Undo2Icon } from "lucide-react";
import { deleteLocalNote, updateLocalNoteTrash } from "@/local/mutations/notes";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function NoteBanner() {
  const router = useRouter();
  const { note } = useNoteEditor();

  const restoreNote = useMutation({
    mutationFn: () =>
      updateLocalNoteTrash({ noteId: note.id, data: { isTrashed: false } }),
    meta: {
      toastOnError: "Failed to restore note, please try again.",
    },
  });

  const deleteNote = useMutation({
    mutationFn: () => deleteLocalNote({ noteId: note.id }),
    meta: {
      toastOnError: "Failed to delete note, please try again.",
    },
    onMutate: () => {
      router.push("/notes");
    },
  });

  if (note.isTrashed) {
    return (
      <div className="bg-destructive flex items-center justify-center gap-6 px-5 py-2 text-center">
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

  return null;
}
