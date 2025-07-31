"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { NoteContent } from "./components/note-content";
import type { EditorNode } from "./utils/types";
import { useEditor } from "./hooks/use-editor";
import { useEditorOperations } from "./hooks/use-editor-operations";
import { EditorInputHandler } from "./components/editor-input-handler";

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
      <CardFooter className="flex flex-col items-start gap-2">
        <div>
          <Button
            disabled={!operations.canUndo}
            onClick={() => operations.undo()}
          >
            Undo
          </Button>
          <Button
            disabled={!operations.canRedo}
            onClick={() => operations.redo()}
          >
            Redo
          </Button>
        </div>

        <div>
          <Button
            variant={`${editor.activeNodeType === "heading-1" ? "default" : "outline"}`}
            onClick={() => operations.toggleNodeType("heading-1")}
          >
            H1
          </Button>
          <Button
            variant={`${editor.activeNodeType === "heading-2" ? "default" : "outline"}`}
            onClick={() => operations.toggleNodeType("heading-2")}
          >
            H2
          </Button>
          <Button
            variant={`${editor.activeNodeType === "heading-3" ? "default" : "outline"}`}
            onClick={() => operations.toggleNodeType("heading-3")}
          >
            H3
          </Button>
          <Button
            variant={`${editor.activeNodeType === "heading-4" ? "default" : "outline"}`}
            onClick={() => operations.toggleNodeType("heading-4")}
          >
            H4
          </Button>
          <Button
            variant={`${editor.activeNodeType === "paragraph" ? "default" : "outline"}`}
            onClick={() => operations.toggleNodeType("paragraph")}
          >
            Paragraph
          </Button>
        </div>
        <div>
          <Button
            variant={`${editor.activeNodeAlignment === "left" ? "default" : "outline"}`}
            onClick={() => operations.toggleNodeAlignment("left")}
          >
            Left
          </Button>
          <Button
            variant={`${editor.activeNodeAlignment === "center" ? "default" : "outline"}`}
            onClick={() => operations.toggleNodeAlignment("center")}
          >
            Center
          </Button>
          <Button
            variant={`${editor.activeNodeAlignment === "right" ? "default" : "outline"}`}
            onClick={() => operations.toggleNodeAlignment("right")}
          >
            Right
          </Button>
          <Button
            variant={`${editor.activeNodeAlignment === "justify" ? "default" : "outline"}`}
            onClick={() => operations.toggleNodeAlignment("justify")}
          >
            Justify
          </Button>
        </div>

        <div>
          <Button
            variant={`${editor.activeMarks.includes("bold") ? "default" : "outline"}`}
            onClick={() => operations.toggleMark("bold")}
          >
            Bold
          </Button>
          <Button
            variant={`${editor.activeMarks.includes("italic") ? "default" : "outline"}`}
            onClick={() => operations.toggleMark("italic")}
          >
            Italic
          </Button>
          <Button
            variant={`${editor.activeMarks.includes("underline") ? "default" : "outline"}`}
            onClick={() => operations.toggleMark("underline")}
          >
            Underline
          </Button>
          <Button
            variant={`${editor.activeMarks.includes("strikethrough") ? "default" : "outline"}`}
            onClick={() => operations.toggleMark("strikethrough")}
          >
            Strikethrough
          </Button>
          <Button
            variant={`${editor.activeMarks.includes("superscript") ? "default" : "outline"}`}
            onClick={() => operations.toggleMark("superscript")}
          >
            Superscript
          </Button>
          <Button
            variant={`${editor.activeMarks.includes("subscript") ? "default" : "outline"}`}
            onClick={() => operations.toggleMark("subscript")}
          >
            Subscript
          </Button>
          <Button
            variant={`${editor.activeMarks.includes("highlight-yellow") ? "default" : "outline"}`}
            onClick={() => operations.toggleMark("highlight-yellow")}
          >
            Highlight Yellow
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

// TODO
// - fix the insertLineBreak (doesn't work at end of a node)
// - fix if I turn off a mark in collapsed state, it splits the node even if the user didn't type
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
