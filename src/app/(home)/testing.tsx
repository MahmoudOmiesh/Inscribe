"use client";

import { useEditor } from "@/text-editor/hooks/use-editor";
import { useEditorActions } from "@/text-editor/hooks/use-editor-actions";
import { NoteEditor } from "@/text-editor/note-editor";

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
    <NoteEditor
      editor={editor}
      actions={actions}
      onContentChange={(content) => {
        console.log("content", content);
      }}
    />
  );
}
