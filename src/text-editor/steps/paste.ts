import type { EditorState } from "../state/editor-state";
import type { Step } from "../state/transaction";
import { insertTextStep } from "./insert-text";

export function pasteStep(
  content: string,
  contentType: "plain" | "html",
): Step {
  return (state: EditorState) => {
    const { nodes, nodeIdIndex, selection } = state;

    if (contentType === "plain") {
      return insertTextStep(content)(state);
    }

    // TODO: Handle HTML content
    return state;
  };
}
