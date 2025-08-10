import type { EditorState } from "../state/editor-state";
import { Transaction } from "../state/transaction";
import { indentStep } from "../steps/indent";
import { outdentStep } from "../steps/outdent";

export function indent(state: EditorState) {
  return new Transaction(state).add(indentStep());
}

export function outdent(state: EditorState) {
  return new Transaction(state).add(outdentStep());
}
