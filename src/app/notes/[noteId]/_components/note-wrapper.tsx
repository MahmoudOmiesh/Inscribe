"use client";

import { api } from "@/trpc/react";
import { NoteContent } from "./note-content";
import { NoteEditorProvider } from "./note-editor-context";
import { NoteHeader } from "./note-header";

export function NoteWrapper({ noteId }: { noteId: number }) {
  const [note] = api.note.get.useSuspenseQuery({ noteId });

  return (
    <NoteEditorProvider note={note}>
      <NoteHeader />
      <NoteContent />
    </NoteEditorProvider>
  );
}
