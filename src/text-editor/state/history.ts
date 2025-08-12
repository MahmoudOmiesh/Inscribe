import type { EditorState } from "./editor-state";

const MAX = 10;

export class History {
  private undo: EditorState[] = [];
  private redo: EditorState[] = [];

  push(prev: EditorState) {
    this.undo.push(prev);
    if (this.undo.length > MAX) this.undo.shift();
    this.redo = [];
  }
  canUndo() {
    return this.undo.length > 0;
  }
  canRedo() {
    return this.redo.length > 0;
  }

  popUndo(current: EditorState): EditorState | null {
    const prev = this.undo.pop();
    if (!prev) return null;
    this.redo.push(current);
    if (this.redo.length > MAX) this.redo.shift();
    return prev;
  }

  popRedo(current: EditorState): EditorState | null {
    const next = this.redo.pop();
    if (!next) return null;
    this.undo.push(current);
    if (this.undo.length > MAX) this.undo.shift();
    return next;
  }
}
