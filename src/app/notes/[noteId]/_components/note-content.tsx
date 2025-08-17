"use client";

import { api } from "@/trpc/react";
import { NoteTitle } from "./note-title";

export function NoteContent({ noteId }: { noteId: number }) {
  const [note] = api.note.get.useSuspenseQuery({ noteId: noteId });

  return (
    <div className="grid flex-1 grid-cols-[1fr_2fr_1fr] grid-rows-[auto_1fr] pt-26">
      <NoteTitle note={note} />
    </div>
  );
}
