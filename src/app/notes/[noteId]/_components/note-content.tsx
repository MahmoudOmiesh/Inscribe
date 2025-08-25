"use client";

import { NoteTitle } from "./note-title";
import { TextEditor } from "@/text-editor/text-editor";
import { useNoteEditor } from "./note-editor-context";
import { api } from "@/trpc/react";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { cn } from "@/lib/utils";

export function NoteContent() {
  const { editor, actions, note } = useNoteEditor();
  const utils = api.useUtils();

  const updateContent = api.note.updateContent.useMutation({
    meta: {
      // invalidateQueries: () => utils.note.get.invalidate({ noteId: note.id }),
      subscribeToMutationStatus: true,
    },
  });

  const debouncedUpdateContentMutate = useDebouncedCallback(
    updateContent.mutate,
    1000,
  );

  return (
    // <div>
    <div
      className={cn(
        "mx-auto w-full flex-1 px-4 py-30",
        note.fullWidth ? "max-w-screen-xl" : "max-w-3xl",
      )}
    >
      <div className="mb-8 w-full">
        <NoteTitle />
      </div>
      <div className="w-full">
        <TextEditor
          editor={editor}
          actions={actions}
          onContentChange={(content) => {
            // console.log(content);
            // debouncedUpdateContentMutate({ noteId: note.id, content });
          }}
          options={{
            font: note.font,
            smallText: note.smallText,
            locked: note.locked,
          }}
        />
      </div>
      {/* </div> */}
    </div>
  );
}
