"use client";

import { Textarea } from "@/components/ui/textarea";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useEffect } from "react";
import { useNoteEditor } from "../note-editor-context";
import { useMutation } from "@tanstack/react-query";
import { updateLocalNoteTitle } from "@/local/mutations/notes";
import { useUserId } from "../../../_components/user-context";

export function NoteTitle() {
  const { note } = useNoteEditor();
  const userId = useUserId();

  const updateTitle = useMutation({
    mutationFn: (title: string) =>
      updateLocalNoteTitle({ noteId: note.id, userId, data: { title } }),
    meta: {
      toastOnError: "Failed to update title, please try again.",
    },
  });

  function handleTitleChange(e: React.FormEvent<HTMLTextAreaElement>) {
    const title = (e.target as HTMLTextAreaElement).value;
    updateTitle.mutate(title);
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
      className="min-h-fit resize-none rounded-none border-0 bg-transparent text-2xl font-bold whitespace-pre-wrap shadow-none outline-0 focus-visible:ring-0 md:text-4xl dark:bg-transparent"
      rows={1}
      wrap="soft"
    />
  );
}
