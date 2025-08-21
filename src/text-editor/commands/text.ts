import type { Mark } from "../model/schema";
import type { EditorState } from "../state/editor-state";
import { Transaction } from "../state/transaction";
import { insertParagraphStep } from "../steps/insert-paragraph";
import { insertTextStep } from "../steps/insert-text";
import { outdentStep } from "../steps/outdent";
import { pasteStep } from "../steps/paste";
import { streamTextStep } from "../steps/stream-text";
import { toggleBlockTypeStep } from "../steps/toggle-block-type";
import { shouldOutdentOnEnter, shouldSwitchListItemToParagraph } from "./rules";

export function insertText(state: EditorState, text: string) {
  if (text.length === 0) return null;
  return new Transaction(state).add(insertTextStep(text));
}

export function streamText(
  state: EditorState,
  nodeId: string,
  text: string,
  marks?: Mark[],
) {
  if (text.length === 0) return null;
  return new Transaction(state).add(streamTextStep(nodeId, text, marks));
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
