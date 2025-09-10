"use client";

import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { EditorContent } from "./components/editor-content";
import { EditorFloatingToolbar } from "./components/floating/editor-floating-toolbar";
import {
  OptionProvider,
  type EditorOptions,
} from "./components/option-context";
import type { useEditor } from "./hooks/use-editor";
import type { useEditorActions } from "./hooks/use-editor-actions";
import { EditorInputHandler } from "./input/editor-input-handler";
import type { EditorNode } from "./model/schema";
import { editorVariables } from "./components/style";

export function TextEditor({
  editor,
  actions,
  onContentChange,
  options = {
    font: "default",
    locked: false,
    smallText: false,
  },
}: {
  editor: ReturnType<typeof useEditor>;
  actions: ReturnType<typeof useEditorActions>;
  onContentChange?: (content: EditorNode[]) => void;
  options?: EditorOptions;
}) {
  useEffect(() => {
    onContentChange?.(editor.state.nodes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor.state.nodes]);

  return (
    <OptionProvider options={options}>
      <EditorInputHandler
        editorRef={editor.editorRef}
        actions={actions}
        undo={editor.undo}
        redo={editor.redo}
      >
        {!options.locked && (
          <EditorFloatingToolbar
            editorRef={editor.editorRef}
            actions={actions}
            active={editor.active}
          />
        )}
        <div
          data-text-editor-root
          ref={editor.editorRef}
          onSelect={editor.handleSelect}
          onDragStart={(e) => {
            e.preventDefault();
          }}
          contentEditable={!options.locked}
          suppressContentEditableWarning
          style={editorVariables[options.smallText ? "small" : "big"]}
          className={cn(
            "isolate px-3 py-2 whitespace-pre outline-none [&>*:first-child]:mt-0",
            options.font === "serif" && "font-serif",
            options.font === "mono" && "font-mono",
          )}
        >
          <EditorContent nodes={editor.state.nodes} actions={actions} />
        </div>
      </EditorInputHandler>
    </OptionProvider>
  );
}

// TODO
// - fix paste when html
// - support for mobile phones
// - deal with firefox bullshit
// - switch mark rendering algorithm to simple one

// - handle losing focus
// - move undo/redo to actions

// idk
// - performance
// - try a branch without the memoization hacks and see if it's actually worth it
// - general clean up for the code
// - support for images
// - support for links
// - support for code blocks
// - support for arabic?
// - support for vim?
