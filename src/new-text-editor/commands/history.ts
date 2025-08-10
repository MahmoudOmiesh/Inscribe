import type { EditorState } from "../state/editor-state";
import type { History } from "../state/history";

export function undo(history: History, current: EditorState) {
  return history.popUndo(current);
}
export function redo(history: History, current: EditorState) {
  return history.popRedo(current);
}
