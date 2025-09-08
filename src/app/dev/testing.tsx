"use client";

import { useEditor } from "@/text-editor/hooks/use-editor";
import { useEditorActions } from "@/text-editor/hooks/use-editor-actions";
import type { EditorNode } from "@/text-editor/model/schema";
import { TextEditor } from "@/text-editor/text-editor";

const TESTING_NODES: EditorNode[] = [
  {
    id: "1",
    type: "paragraph",
    text: "",
    alignment: "left",
    marks: [],
  },
];

export function Testing() {
  const editor = useEditor(TESTING_NODES);
  const editorActions = useEditorActions(
    editor.getState,
    editor.dispatch,
    editor.preserveTypingMarksAtCurrentPosition,
  );

  return (
    <div className="bg-card min-h-[500px] min-w-[500px] p-4">
      <TextEditor
        editor={editor}
        actions={editorActions}
        onContentChange={(content) => {
          console.log("content", content);
        }}
      />
    </div>
  );
}
