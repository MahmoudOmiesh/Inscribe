"use client";

import type { LocalNote } from "@/local/schema/note";
import { useEditor } from "@/text-editor/hooks/use-editor";
import { useEditorActions } from "@/text-editor/hooks/use-editor-actions";
import type { EditorNode } from "@/text-editor/model/schema";
import { createContext, use } from "react";

interface NoteEditorContextType {
  editor: ReturnType<typeof useEditor>;
  actions: ReturnType<typeof useEditorActions>;
  note: LocalNote;
}

const NoteEditorContext = createContext<NoteEditorContextType | null>(null);

export function NoteEditorProvider({
  children,
  note,
}: {
  children: React.ReactNode;
  note: LocalNote;
}) {
  const editor = useEditor(JSON.parse(note.content) as EditorNode[]);
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
