"use client";

import { EditorContent } from "./components/editor-content";
import type { useEditor } from "./hooks/use-editor";
import type { useEditorActions } from "./hooks/use-editor-actions";
import { EditorInputHandler } from "./input/editor-input-handler";
import { EditorFloatingToolbar } from "./components/floating/editor-floating-toolbar";
import { useEffect } from "react";
import type { EditorNode } from "./model/schema";

export function TextEditor({
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
        data-text-editor-root
        ref={editor.editorRef}
        onSelect={editor.handleSelect}
        onDragStart={(e) => {
          e.preventDefault();
        }}
        contentEditable
        suppressContentEditableWarning
        className="space-y-2 px-3 py-2 whitespace-pre outline-none"
      >
        <EditorContent nodes={editor.state.nodes} actions={actions} />
      </div>
    </EditorInputHandler>
  );
}

// TODO
// - fix floating node modifier not closing when clicking outside
// - group operations together in undo/redo
// - handle losing focus
// - imrpove the ui
// - add ai to editor

// idk
// - performance
// - general clean up for the code
// - support for images
// - support for links
// - support for code blocks and blockquotes
// - support for arabic?
// - support for vim?
