"use client";

import type { Note } from "@/lib/schema/note";
import { useEditor } from "@/text-editor/hooks/use-editor";
import { useEditorActions } from "@/text-editor/hooks/use-editor-actions";
import type { EditorNode } from "@/text-editor/model/schema";
import { createContext, use } from "react";

interface NoteEditorContextType {
  editor: ReturnType<typeof useEditor>;
  actions: ReturnType<typeof useEditorActions>;
  note: Note;
}

const NoteEditorContext = createContext<NoteEditorContextType | null>(null);

export function NoteEditorProvider({
  children,
  note,
}: {
  children: React.ReactNode;
  note: Note;
}) {
  // const editor = useEditor(note.content as unknown as EditorNode[]);
  const editor = useEditor([]);
  const actions = useEditorActions(
    editor.getState,
    editor.dispatch,
    editor.preserveTypingMarksAtCurrentPosition,
  );

  return (
    <NoteEditorContext.Provider value={{ editor, actions, note }}>
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
