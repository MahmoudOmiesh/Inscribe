"use client";

import { Textarea } from "@/components/ui/textarea";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useEffect } from "react";
import { useNoteEditor } from "../note-editor-context";
import { useNoteMutations } from "../../mutations";
import { cn } from "@/lib/utils";

export function NoteTitle() {
  const { note, editor } = useNoteEditor();

  const { updateTitle } = useNoteMutations(note.id);

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

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" || e.key === "ArrowDown") {
      e.preventDefault();
      editor.editorRef.current?.focus();
    }
  }

  return (
    <Textarea
      defaultValue={note.title}
      onInput={handleTitleChange}
      onKeyDown={handleKeyDown}
      placeholder="New Note"
      className={cn(
        "min-h-fit resize-none rounded-none border-0 bg-transparent text-2xl font-bold whitespace-pre-wrap shadow-none outline-0 focus-visible:ring-0 md:text-4xl dark:bg-transparent",
        note.font === "serif" && "font-serif",
        note.font === "mono" && "font-mono",
      )}
      rows={1}
      wrap="soft"
    />
  );
}
