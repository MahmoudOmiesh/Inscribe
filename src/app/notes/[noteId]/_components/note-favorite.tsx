import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNoteEditor } from "./note-editor-context";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { api } from "@/trpc/react";

export function NoteFavorite() {
  const { note } = useNoteEditor();
  const utils = api.useUtils();

  const toggleFavorite = api.note.toggleFavorite.useMutation({
    meta: {
      invalidateQueries: () => utils.note.get.invalidate({ noteId: note.id }),
      subscribeToMutationStatus: true,
    },
  });

  const debouncedToggleFavorite = useDebouncedCallback(
    toggleFavorite.mutate,
    1000,
  );

  function handleToggleFavorite() {
    const isFavorite = !note.isFavorite;

    // Update the note in the cache
    utils.note.get.setData({ noteId: note.id }, (prevNote) => {
      if (!prevNote) return prevNote;
      return { ...prevNote, isFavorite };
    });

    debouncedToggleFavorite({ noteId: note.id, isFavorite });
  }

  return (
    <div>
      <Button
        variant="ghost"
        size="icon"
        disabled={toggleFavorite.isPending}
        onClick={handleToggleFavorite}
      >
        <StarIcon
          className={cn(note.isFavorite && "fill-yellow-500 text-yellow-500")}
        />
      </Button>
    </div>
  );
}
