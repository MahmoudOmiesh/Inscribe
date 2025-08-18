import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";
import type { Note } from "@/lib/schema/note";
import { cn } from "@/lib/utils";
import { NOTE_MUTATIONS } from "../mutations";

export function NoteFavorite({ note }: { note: Note }) {
  const toggleFavorite = NOTE_MUTATIONS.toggleFavorite(note.id);

  return (
    <div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          // prevent spamming which causes race conditions
          if (toggleFavorite.isPending) return;
          toggleFavorite.mutate({ noteId: note.id });
        }}
      >
        <StarIcon
          className={cn(note.isFavorite && "fill-yellow-500 text-yellow-500")}
        />
      </Button>
    </div>
  );
}
