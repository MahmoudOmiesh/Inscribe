"use client";

import { Button } from "@/components/ui/button";
import { useEditor } from "@/text-editor/hooks/use-editor";
import { useEditorActions } from "@/text-editor/hooks/use-editor-actions";
import type { EditorNode } from "@/text-editor/model/schema";
import { TextEditor } from "@/text-editor/text-editor";
import { useState } from "react";

const TEST_CONTENT: EditorNode[] = [
  {
    id: "VlxE9Z61fbxki48MFwJI_",
    text: "Heading 1 ",
    type: "heading-1",
    marks: [],
    alignment: "left",
  },
  {
    id: "tNKlOOjebaht44uZXgXas",
    text: "Heading 2",
    type: "heading-2",
    marks: [],
    alignment: "left",
  },
  {
    id: "HeP_f-yPDYlfOpX4afGwS",
    text: "Heading 3",
    type: "heading-3",
    marks: [],
    alignment: "left",
  },
  {
    id: "l3eWuvWIiz0rcOvK_rmKr",
    text: "Heading 4",
    type: "heading-4",
    marks: [],
    alignment: "left",
  },
  {
    id: "S2aKLzLM5SVsvJauLGhe4",
    text: "paragraph",
    type: "paragraph",
    marks: [],
    alignment: "left",
  },
  {
    id: "NjwCuxi885S7Fpj6OiCyh",
    text: "bullet 1",
    type: "unordered-list-item",
    marks: [],
    listId: "PH_kZ7mUHEiM_BZ8TfFm6",
    alignment: "left",
    indentLevel: 0,
  },
  {
    id: "6JCfJixR1Ut46Jeul-yik",
    text: "bullet 2",
    type: "unordered-list-item",
    marks: [],
    listId: "PH_kZ7mUHEiM_BZ8TfFm6",
    alignment: "left",
    indentLevel: 0,
  },
  {
    id: "_nXiosAftSoiKSiqnOoe_",
    text: "bullet nested",
    type: "unordered-list-item",
    marks: [],
    listId: "PH_kZ7mUHEiM_BZ8TfFm6",
    alignment: "left",
    indentLevel: 1,
  },
  {
    id: "8XnTL8UocZhaLmO68gOau",
    text: "numbered 1",
    type: "ordered-list-item",
    marks: [],
    listId: "22El3xS-1OYPn7EhiZZ0E",
    alignment: "left",
    indentLevel: 0,
  },
  {
    id: "i9L5TnzFXffqUseihoB0-",
    text: "numbered 2",
    type: "ordered-list-item",
    marks: [],
    listId: "22El3xS-1OYPn7EhiZZ0E",
    alignment: "left",
    indentLevel: 0,
  },
  {
    id: "ACd_QmVBQoU-xR31VJK6U",
    text: "numbered nested",
    type: "ordered-list-item",
    marks: [],
    listId: "22El3xS-1OYPn7EhiZZ0E",
    alignment: "left",
    indentLevel: 1,
  },
  {
    id: "XLZAK0w-PfAGPY-hI2Ono",
    text: "to do 1",
    type: "check-list-item",
    marks: [],
    listId: "TAm_4FK22dN9Fb1nI4BSy",
    checked: true,
    alignment: "left",
    indentLevel: 0,
  },
  {
    id: "xYHkRfHNZxY8_6-vQsD_n",
    text: "to do 2",
    type: "check-list-item",
    marks: [],
    listId: "TAm_4FK22dN9Fb1nI4BSy",
    checked: true,
    alignment: "left",
    indentLevel: 0,
  },
  {
    id: "46dG7BmGnERq76eGcvh8T",
    text: "to do nested",
    type: "check-list-item",
    marks: [],
    listId: "TAm_4FK22dN9Fb1nI4BSy",
    checked: true,
    alignment: "left",
    indentLevel: 1,
  },
  {
    id: "M-Ag1Z7_gcbb0dZfFpa9H",
    text: "paragraph hey",
    type: "blockquote",
    marks: [],
    alignment: "left",
  },
];

export default function Testing() {
  const [smallText, setSmallText] = useState(false);
  const editor = useEditor(TEST_CONTENT);
  const actions = useEditorActions(
    editor.getState,
    editor.dispatch,
    editor.preserveTypingMarksAtCurrentPosition,
  );

  return (
    <>
      <div className="bg-card mt-36 mb-10">
        <TextEditor
          editor={editor}
          actions={actions}
          options={{
            font: "default",
            smallText,
            // locked: true,
          }}
          // onContentChange={(content) => {
          //   console.log("content", content);
          // }}
        />
      </div>
      <Button onClick={() => editor.undo()} disabled={!editor.canUndo}>
        Undo
      </Button>
      <Button onClick={() => editor.redo()} disabled={!editor.canRedo}>
        Redo
      </Button>
      <Button onClick={() => setSmallText(!smallText)}>
        {smallText ? "Big Text" : "Small Text"}
      </Button>
      <Button onClick={() => console.log(editor.state.nodes)}>Log Nodes</Button>
    </>
  );
}
