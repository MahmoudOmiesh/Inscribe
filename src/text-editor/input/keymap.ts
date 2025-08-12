import type { useEditorActions } from "../hooks/use-editor-actions";

function isMod(e: KeyboardEvent) {
  return e.metaKey || e.ctrlKey;
}

function isModAndShift(e: KeyboardEvent) {
  return isMod(e) && e.shiftKey;
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
    case e.code === "Digit7" && isModAndShift(e): {
      e.preventDefault();
      actions.toggleBlock("ordered-list-item");
      return;
    }
    case e.code === "Digit8" && isModAndShift(e): {
      e.preventDefault();
      actions.toggleBlock("unordered-list-item");
      return;
    }
    case e.code === "Digit9" && isModAndShift(e): {
      e.preventDefault();
      actions.toggleBlock("check-list-item");
      return;
    }
    default:
      return;
  }
}
