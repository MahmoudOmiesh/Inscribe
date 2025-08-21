"use client";

import { Button } from "@/components/ui/button";
import { useEditor } from "@/text-editor/hooks/use-editor";
import { useEditorActions } from "@/text-editor/hooks/use-editor-actions";
import { TextEditor } from "@/text-editor/text-editor";

export default function Testing() {
  const editor = useEditor([
    {
      type: "paragraph",
      text: "hello",
      id: "1",
      alignment: "left",
      marks: [],
    },
    {
      type: "paragraph",
      text: "world",
      id: "2",
      alignment: "left",
      marks: [],
    },
    {
      type: "paragraph",
      text: "hello world",
      id: "3",
      alignment: "left",
      marks: [],
    },
  ]);
  const actions = useEditorActions(
    editor.getState,
    editor.dispatch,
    editor.preserveTypingMarksAtCurrentPosition,
  );

  return (
    <>
      <div className="bg-card">
        <TextEditor
          editor={editor}
          actions={actions}
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
      <Button onClick={() => console.log(editor.state.nodes)}>Log Nodes</Button>
    </>
  );
}
