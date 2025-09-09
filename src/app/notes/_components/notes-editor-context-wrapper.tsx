"use client";

import { useParams } from "next/navigation";
import { NoteEditorProvider } from "../[noteId]/_components/note-editor-context";

export function NotesEditorContextWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { noteId } = useParams();

  if (!noteId) {
    return children;
  }

  return (
    <NoteEditorProvider noteId={noteId as string}>
      {children}
    </NoteEditorProvider>
  );
}
