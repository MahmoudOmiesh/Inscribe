"use client";

import { NoteTitle } from "./note-title";
import { TextEditor } from "@/text-editor/text-editor";
import { useNoteEditor } from "./note-editor-context";
import { api } from "@/trpc/react";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

export function NoteContent() {
  const { editor, actions, note } = useNoteEditor();

  const updateContent = api.note.updateContent.useMutation({
    meta: {
      subscribeToMutationStatus: true,
    },
  });

  const debouncedUpdateContentMutate = useDebouncedCallback(
    updateContent.mutate,
    1000,
  );

  return (
    <div className="grid flex-1 grid-cols-[1fr_2fr_1fr] grid-rows-[auto_1fr] gap-y-6 pt-26 pb-40">
      <div className="col-start-2">
        <NoteTitle />
      </div>
      <div className="col-start-2">
        <TextEditor
          editor={editor}
          actions={actions}
          onContentChange={(content) => {
            // console.log(content);
            debouncedUpdateContentMutate({ noteId: note.id, content });
          }}
        />
      </div>
    </div>
  );
}
