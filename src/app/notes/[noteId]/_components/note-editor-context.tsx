"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useLocalNote } from "@/local/queries/notes";
import type { LocalNote } from "@/local/schema/note";
import { useEditor } from "@/text-editor/hooks/use-editor";
import { useEditorActions } from "@/text-editor/hooks/use-editor-actions";
import Link from "next/link";
import { createContext, use, useEffect, useRef } from "react";

type NoteWithFolder = LocalNote & {
  folderName: string;
  folderEmoji: string;
};

interface NoteEditorContextType {
  editor: ReturnType<typeof useEditor>;
  actions: ReturnType<typeof useEditorActions>;
  note: NoteWithFolder;
}

const NoteEditorContext = createContext<NoteEditorContextType | null>(null);

export function NoteEditorProvider({
  children,
  noteId,
}: {
  children: React.ReactNode;
  noteId: string;
}) {
  const note = useLocalNote(noteId);
  const isNotePending =
    (note && "isPending" in note && note.isPending) ?? false;

  const stableNoteRef = useRef<NoteWithFolder | null>(null);

  useEffect(() => {
    if (!isNotePending && note) {
      stableNoteRef.current = note as NoteWithFolder;
    }
  }, [note, isNotePending]);

  const currentNote = isNotePending
    ? stableNoteRef.current
    : (note as NoteWithFolder);

  if (!currentNote && !isNotePending) {
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

  // first load only
  if (!currentNote) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <EditorProvider note={currentNote} key={currentNote.id}>
      {children}
    </EditorProvider>
  );
}

function EditorProvider({
  note,
  children,
}: {
  note: NoteWithFolder;
  children: React.ReactNode;
}) {
  const editor = useEditor(note.content);
  const actions = useEditorActions(
    editor.getState,
    editor.dispatch,
    editor.preserveTypingMarksAtCurrentPosition,
  );

  return (
    <NoteEditorContext.Provider
      value={{
        editor,
        actions,
        note,
      }}
    >
      {children}
    </NoteEditorContext.Provider>
  );
}

export function useNoteEditor() {
  const context = use(NoteEditorContext);

  if (!context) {
    throw new Error("useNoteEditor must be used within a NoteEditorProvider");
  }

  return context;
}
