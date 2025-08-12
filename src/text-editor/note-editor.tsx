"use client";

import { Card, CardContent } from "@/components/ui/card";
import { NoteContent } from "./components/note-content";
import type { EditorNode } from "./model/schema";
import { useEditor } from "./hooks/use-editor";
import { useEditorActions } from "./hooks/use-editor-actions";
import { EditorInputHandler } from "./input/editor-input-handler";
import { EditorFloatingToolbar } from "./components/editor-floating-toolbar";

const DEFAULT_NODES: EditorNode[] = [
  {
    id: "20ce649b-df96-447c-b90a-5715989b02c4",
    type: "heading-1",
    text: "Heading bold not bold",
    alignment: "left",
    marks: [
      { type: "italic", start: 9, end: 10 },
      { type: "bold", start: 8, end: 12 },
    ],
  },
  {
    id: "20ce649b-df96-447c-b90a-5715989b02c5",
    type: "unordered-list-item",
    text: "List item 1",
    alignment: "left",
    listId: "123",
    indentLevel: 0,
    marks: [],
  },
  {
    id: "20ce649b-df96-447c-b90a-5715989b02c6",
    type: "unordered-list-item",
    text: "List item 2",
    alignment: "left",
    listId: "123",
    indentLevel: 0,
    marks: [],
  },
  {
    id: "20ce649b-df96-447c-b90a-5715989b02c7",
    type: "check-list-item",
    text: "Check list item 1",
    checked: true,
    alignment: "left",
    listId: "456",
    indentLevel: 0,
    marks: [],
  },

  // {
  //   id: "cb7929b8-77a4-4fa0-8b4a-c3d190e5dfb8",
  //   type: "paragraph",
  //   text: "Hello, world!",
  //   alignment: "left",
  //   marks: [
  //     {
  //       type: "bold",
  //       start: 0,
  //       end: 5,
  //     },
  //   ],
  // },
  // {
  //   id: "12345678-1234-1234-1234-123456789012",
  //   type: "paragraph",
  //   text: "",
  //   alignment: "left",
  //   marks: [],
  // },
];

export function NoteEditor() {
  const editor = useEditor(DEFAULT_NODES);
  const actions = useEditorActions(
    editor.getState,
    editor.dispatch,
    editor.preserveTypingMarksAtCurrentPosition,
  );

  return (
    <Card className="md:w-3xl">
      <CardContent>
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
            className="space-y-2 p-0.5 whitespace-pre outline-none"
          >
            <NoteContent
              nodes={editor.state.nodes}
              toggleCheckbox={actions.toggleCheckbox}
            />
          </div>
        </EditorInputHandler>
      </CardContent>
    </Card>
  );
}

// TODO
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
