"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NoteContent } from "./components/note-content";
import type { EditorNode } from "./utils/types";
import { useEditor } from "./hooks/use-editor";
import { useEditorOperations } from "./hooks/use-editor-operations";
import { EditorInputHandler } from "./components/editor-input-handler";
import { EditorToolbar } from "./components/editor-toolbar";

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
  const operations = useEditorOperations(editor);

  return (
    <Card className="md:w-xl">
      <CardHeader>
        <EditorToolbar editor={editor} operations={operations} />
      </CardHeader>
      <CardContent>
        <EditorInputHandler operations={operations} editorRef={editor.ref}>
          <div
            ref={editor.ref}
            onSelect={editor.handleSelect}
            onDragStart={(e) => {
              e.preventDefault();
            }}
            contentEditable
            suppressContentEditableWarning
            className="space-y-2 p-0.5 whitespace-pre outline-none"
          >
            <NoteContent nodes={editor.nodes} />
          </div>
        </EditorInputHandler>
      </CardContent>
    </Card>
  );
}

// TODO
// - fix the insertLineBreak (doesn't work at end of a node)
// - fix if I turn off a mark in collapsed state, it splits the node even if the user didn't type

// - fix if I switch a node in a middle of a list, it created 2 lists with same id
// - might wanna treat a list as a single node when switching node types

// - fix randoms bugs with lists, when merging and deleting

// - handle losing focus
// - support for lists (unordered, ordered, task)
// - imrpove the ui

// - performance
// - general clean up for the code
// - support for images
// - support for links
// - support for code blocks and blockquotes
// - support for arabic?
// - support for vim?
