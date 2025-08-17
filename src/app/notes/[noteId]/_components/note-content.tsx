"use client";

import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { api } from "@/trpc/react";

export function NoteContent({ noteId }: { noteId: number }) {
  const [note] = api.note.get.useSuspenseQuery({ noteId: noteId });

  const utils = api.useUtils();

  const updateTitle = api.note.updateTitle.useMutation({
    meta: {
      invalidateQueries: () => utils.folder.getNotes.invalidate(),
      subscribeToMutationStatus: true,
    },
  });

  const debouncedUpdateTitleMutate = useDebouncedCallback(
    updateTitle.mutate,
    1000,
  );

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;

    // Update the note in the cache
    utils.note.get.setData({ noteId: noteId }, (old) => {
      if (!old) return old;
      return { ...old, title };
    });

    // Update the note in the folder
    utils.folder.getNotes.setData({ folderId: note.folderId }, (old) => {
      if (!old) return old;
      return old.map((note) => {
        if (note.id === noteId) return { ...note, title };
        return note;
      });
    });

    debouncedUpdateTitleMutate({ noteId: noteId, title });
  }

  return (
    <div className="flex-1">
      <Input defaultValue={note.title} onChange={handleTitleChange} />
    </div>
  );
}
