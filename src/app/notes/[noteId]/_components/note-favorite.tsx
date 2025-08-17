import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";
import type { Note } from "@/lib/schema/note";
import { cn } from "@/lib/utils";

export function NoteFavorite({ note }: { note: Note }) {
  const utils = api.useUtils();

  const toggleFavorite = api.note.toggleFavorite.useMutation({
    onMutate: async () => {
      await utils.note.get.cancel();

      const prevNote = utils.note.get.getData({ noteId: note.id });

      utils.note.get.setData({ noteId: note.id }, (old) => {
        if (!old) return old;
        return { ...old, isFavorite: !old.isFavorite };
      });

      return { prevNote };
    },
    onError: (_e, _v, context) => {
      utils.note.get.setData({ noteId: note.id }, context?.prevNote);
    },
    meta: {
      subscribeToMutationStatus: true,
    },
  });

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
