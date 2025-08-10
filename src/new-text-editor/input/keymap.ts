import type { useEditorActions } from "../hooks/use-editor-actions";

function isMod(e: KeyboardEvent) {
  return e.metaKey || e.ctrlKey;
}

export function handleKeyDown(
  e: KeyboardEvent,
  actions: ReturnType<typeof useEditorActions>,
) {
  switch (true) {
    case e.key === "Tab" && !e.shiftKey: {
      e.preventDefault();
      actions.indent();
      return;
    }
    case e.key === "Tab" && e.shiftKey: {
      e.preventDefault();
      actions.outdent();
      return;
    }
    default:
      return;
  }
}
