import { normalizePipeline } from "../normalize/pipeline";
import type { EditorState } from "./editor-state";

export type Step = (state: EditorState) => EditorState;
export type Dispatch = (tx: Transaction) => void;

export class Transaction {
  private steps: Step[] = [];

  constructor(private editorState: EditorState) {}

  add(step: Step) {
    this.steps.push(step);
    return this;
  }

  apply() {
    let state = this.editorState;
    for (const step of this.steps) {
      state = step(state);
      state = normalizePipeline(state);
    }
    return state;
  }
}
