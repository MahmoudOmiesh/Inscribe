"use client";

import { NoteContent } from "./body/note-content";
import { NoteEditorProvider } from "./note-editor-context";
import { NoteHeader } from "./header/note-header";
import { useLocalNote } from "@/local/queries/notes";
import { Button } from "@/components/ui/button";
import type { LocalNote } from "@/local/schema/note";
import Link from "next/link";
import { Spinner } from "@/components/spinner";
import { NoteBanner } from "./header/note-banner";
import { useDelayedVisible } from "@/hooks/use-delayed-visible";

export function NoteWrapper({ noteId }: { noteId: string }) {
  const note = useLocalNote(noteId);

  const isNotePending =
    (note && "isPending" in note && note.isPending) ?? false;
  const showLoading = useDelayedVisible(isNotePending);

  if (isNotePending) {
    return showLoading ? <SuspenseFallback /> : null;
  }

  if (!note) {
    return <ErrorFallback />;
  }

  return (
    <NoteEditorProvider note={note as LocalNote}>
      <div className="sticky top-0 z-10">
        <NoteHeader />
        <NoteBanner />
      </div>
      <NoteContent />
    </NoteEditorProvider>
  );
}

function ErrorFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-xl font-bold">This note could not be found</h3>
        <p className="text-muted-foreground text-sm">
          Make sure you are using the correct link.
        </p>
        <Button variant="outline" asChild className="mt-4">
          <Link href="/notes">Go back</Link>
        </Button>
      </div>
    </div>
  );
}

function SuspenseFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
