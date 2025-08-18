"use client";

import { NoteContent } from "./components/note-content";
import type { useEditor } from "./hooks/use-editor";
import type { useEditorActions } from "./hooks/use-editor-actions";
import { EditorInputHandler } from "./input/editor-input-handler";
import { EditorFloatingToolbar } from "./components/editor-floating-toolbar";
import { useEffect } from "react";
import type { EditorNode } from "./model/schema";

export function NoteEditor({
  editor,
  actions,
  onContentChange,
}: {
  editor: ReturnType<typeof useEditor>;
  actions: ReturnType<typeof useEditorActions>;
  onContentChange?: (content: EditorNode[]) => void;
}) {
  useEffect(() => {
    onContentChange?.(editor.state.nodes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor.state.nodes]);

  return (
    <EditorInputHandler editorRef={editor.editorRef} actions={actions}>
      <EditorFloatingToolbar
        editorRef={editor.editorRef}
        actions={actions}
        active={editor.active}
      />
      <div
        ref={editor.editorRef}
        onSelect={editor.handleSelect}
        onDragStart={(e) => {
          e.preventDefault();
        }}
        contentEditable
        suppressContentEditableWarning
        className="space-y-2 px-3 py-2 whitespace-pre outline-none"
      >
        <NoteContent nodes={editor.state.nodes} actions={actions} />
      </div>
    </EditorInputHandler>
  );
}

// TODO
// - fix floating node modifier not closing when clicking outside
// - fix getSelectionRange doesn't work if there is one empty node in the editor
// - fix remove / after executing command
// - group operations together in undo/redo
// - handle losing focus
// - imrpove the ui

// idk
// - performance
// - general clean up for the code
// - support for images
// - support for links
// - support for code blocks and blockquotes
// - support for separators and emojis
// - support for arabic?
// - support for vim?
