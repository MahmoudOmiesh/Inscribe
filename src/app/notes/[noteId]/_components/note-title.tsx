"use client";

import { Textarea } from "@/components/ui/textarea";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { api } from "@/trpc/react";
import { useEffect } from "react";
import { useNoteEditor } from "./note-editor-context";

export function NoteTitle() {
  const { note } = useNoteEditor();
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

  function handleTitleChange(e: React.FormEvent<HTMLTextAreaElement>) {
    const title = (e.target as HTMLTextAreaElement).value;

    // Update the note in the cache
    utils.note.get.setData({ noteId: note.id }, (prevNote) => {
      if (!prevNote) return prevNote;
      return { ...prevNote, title };
    });

    // Update the note in the folder
    utils.folder.getNotes.setData({ folderId: note.folderId }, (prevNotes) => {
      if (!prevNotes) return prevNotes;
      return prevNotes.map((prevNote) => {
        if (prevNote.id === note.id) return { ...prevNote, title };
        return prevNote;
      });
    });

    debouncedUpdateTitleMutate({ noteId: note.id, title });
  }

  const updateDocumentTitle = useDebouncedCallback((title: string) => {
    document.title = title;
  }, 1000);

  useEffect(() => {
    updateDocumentTitle(note.title);
  }, [note.title, updateDocumentTitle]);

  return (
    <Textarea
      defaultValue={note.title}
      onInput={handleTitleChange}
      placeholder="New Note"
      className="resize-none rounded-none border-0 bg-transparent font-bold whitespace-pre-wrap shadow-none outline-0 focus-visible:ring-0 md:text-4xl dark:bg-transparent"
      rows={1}
      wrap="soft"
    />
  );
}
