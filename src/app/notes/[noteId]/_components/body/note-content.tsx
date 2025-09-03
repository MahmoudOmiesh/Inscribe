"use client";

import { NoteTitle } from "./note-title";
import { TextEditor } from "@/text-editor/text-editor";
import { useNoteEditor } from "../note-editor-context";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { cn } from "@/lib/utils";
import { NOTE_MUTATIONS } from "../../mutations";

export function NoteContent() {
  const { editor, actions, note } = useNoteEditor();

  const updateContent = NOTE_MUTATIONS.updateContent(note.id);

  const debouncedUpdateContentMutate = useDebouncedCallback(
    updateContent.mutate,
    1000,
  );

  return (
    <div
      className={cn(
        "mx-auto w-full flex-1 px-4 py-10 md:py-30",
        note.fullWidth ? "max-w-screen-xl" : "max-w-3xl",
      )}
    >
      <div className="mb-4 w-full md:mb-8">
        <NoteTitle />
      </div>
      <div className="w-full">
        <TextEditor
          editor={editor}
          actions={actions}
          onContentChange={(content) => {
            // console.log(content);
            debouncedUpdateContentMutate(content);
          }}
          options={{
            font: note.font,
            smallText: note.smallText,
            locked: note.locked,
          }}
        />
      </div>
    </div>
  );
}
