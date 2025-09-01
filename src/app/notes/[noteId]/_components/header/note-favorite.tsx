import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNoteEditor } from "../note-editor-context";
import { useMutation } from "@tanstack/react-query";
import { updateLocalNoteFavorite } from "@/local/mutations/notes";
import { useUserId } from "../../../_components/user-context";

export function NoteFavorite() {
  const { note } = useNoteEditor();
  const userId = useUserId();

  const toggleFavorite = useMutation({
    mutationFn: (isFavorite: boolean) =>
      updateLocalNoteFavorite({
        noteId: note.id,
        userId,
        data: { isFavorite },
      }),
    meta: {
      toastOnError: "Failed to toggle favorite, please try again.",
    },
  });

  if (note.isTrashed || note.isArchived) {
    return null;
  }

  return (
    <div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => toggleFavorite.mutate(!note.isFavorite)}
      >
        <StarIcon
          className={cn(note.isFavorite && "fill-yellow-500 text-yellow-500")}
        />
      </Button>
    </div>
  );
}
