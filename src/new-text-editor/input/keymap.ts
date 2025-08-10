import { listCommands } from "../commands";
import type { EditorState } from "../state/editor-state";
import type { Dispatch } from "../state/transaction";

function isMod(e: KeyboardEvent) {
  return e.metaKey || e.ctrlKey;
}

export function handleKeyDown(
  e: KeyboardEvent,
  state: EditorState,
  dispatch: Dispatch,
) {
  switch (true) {
    case e.key === "Tab" && !e.shiftKey: {
      e.preventDefault();
      const tx = listCommands.indent(state);
      if (tx) dispatch(tx);
      return;
    }
    case e.key === "Tab" && e.shiftKey: {
      e.preventDefault();
      const tx = listCommands.outdent(state);
      if (tx) dispatch(tx);
      return;
    }
    default:
      return;
  }
}
