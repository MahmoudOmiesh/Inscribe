import { getSelectionRange } from "../utils/range";
import type { EditorNode, Mark, Operation } from "../utils/types";
import { shouldSwitchListItemToParagraph } from "./helpers";

export function createToggleMarkCommand(
  markType: Mark["type"],
): Operation | null {
  const range = getSelectionRange();
  if (!range) return null;

  return {
    type: "toggleMark",
    markType,
    range,
  };
}

export function createToggleNodeTypeCommand(
  nodeType: EditorNode["type"],
): Operation | null {
  const range = getSelectionRange();
  if (!range) return null;

  return {
    type: "toggleNodeType",
    nodeType,
    range,
  };
}

export function createToggleAlignmentCommand(
  alignment: EditorNode["alignment"],
): Operation | null {
  const range = getSelectionRange();
  if (!range) return null;

  return {
    type: "toggleNodeAlignment",
    alignment,
    range,
  };
}

export function createIndentListItemCommand(): Operation | null {
  const range = getSelectionRange();
  if (!range) return null;

  return {
    type: "indentListItem",
    range,
  };
}

export function createUnindentListItemCommand(
  nodes: EditorNode[],
): Operation | null {
  const range = getSelectionRange();
  if (!range) return null;

  if (shouldSwitchListItemToParagraph(range, nodes)) {
    return {
      type: "toggleNodeType",
      nodeType: "paragraph",
      range,
    };
  }

  return {
    type: "unindentListItem",
    range,
  };
}
