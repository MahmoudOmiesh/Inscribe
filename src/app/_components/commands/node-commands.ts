import { getSelectionRange } from "../utils/range";
import type { EditorNode, Mark, Operation } from "../utils/types";

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
