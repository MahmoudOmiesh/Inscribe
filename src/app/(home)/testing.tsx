"use client";

import { useEditor } from "@/text-editor/hooks/use-editor";
import { useEditorActions } from "@/text-editor/hooks/use-editor-actions";
import { TextEditor } from "@/text-editor/text-editor";

export default function Testing() {
  const editor = useEditor([
    {
      type: "paragraph",
      text: "",
      id: "1",
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
    <TextEditor
      editor={editor}
      actions={actions}
      // onContentChange={(content) => {
      //   console.log("content", content);
      // }}
    />
  );
}
