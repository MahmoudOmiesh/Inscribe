import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNoteEditor } from "../note-editor-context";
import { useNoteMutations } from "../../mutations";

export function NoteFavorite() {
  const { note } = useNoteEditor();

  const { updateFavorite } = useNoteMutations(note.id);

  if (note.isTrashed || note.isArchived) {
    return null;
  }

  return (
    <div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => updateFavorite.mutate(!note.isFavorite)}
      >
        <StarIcon
          className={cn(note.isFavorite && "fill-yellow-500 text-yellow-500")}
        />
      </Button>
    </div>
  );
}
