import type { EditorState } from "../state/editor-state";
import { Transaction } from "../state/transaction";
import { insertParagraphStep } from "../steps/insert-paragraph";
import { insertTextStep } from "../steps/insert-text";
import { outdentStep } from "../steps/outdent";
import { pasteStep } from "../steps/paste";
import { toggleBlockTypeStep } from "../steps/toggle-block-type";
import { shouldOutdentOnEnter, shouldSwitchListItemToParagraph } from "./rules";

export function insertText(state: EditorState, text: string) {
  return new Transaction(state).add(insertTextStep(text));
}

export function insertParagraph(state: EditorState) {
  const { nodes, nodeIdIndex, selection } = state;

  if (shouldOutdentOnEnter(nodes, nodeIdIndex, selection)) {
    return new Transaction(state).add(outdentStep());
  }

  if (shouldSwitchListItemToParagraph(nodes, nodeIdIndex, selection)) {
    return new Transaction(state).add(
      toggleBlockTypeStep("paragraph", { treatListAsSingleNode: false }),
    );
  }

  return new Transaction(state).add(insertParagraphStep());
}

export function paste(
  state: EditorState,
  content: string,
  contentType: "plain" | "html",
) {
  return new Transaction(state).add(pasteStep(content, contentType));
}
