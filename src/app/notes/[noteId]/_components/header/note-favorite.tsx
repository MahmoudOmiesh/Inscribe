import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNoteEditor } from "../note-editor-context";
import { NOTE_MUTATIONS } from "../../mutations";

export function NoteFavorite() {
  const { note } = useNoteEditor();

  const toggleFavorite = NOTE_MUTATIONS.updateFavorite(note.id);

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
