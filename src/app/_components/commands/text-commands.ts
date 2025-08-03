import { getSelectionRange } from "../utils/range";
import type { EditorNode, Operation } from "../utils/types";
import { v4 as uuidv4 } from "uuid";
import {
  shouldSwitchListItemToParagraph,
  shouldUnindentListItem,
} from "./helpers";

export function createInsertTextCommand(text: string): Operation | null {
  const range = getSelectionRange();
  if (!range) return null;

  return {
    type: "insertText",
    text,
    range,
  };
}

export function createInsertParagraphCommand(
  nodes: EditorNode[],
): Operation | null {
  const range = getSelectionRange();
  if (!range) return null;

  if (shouldUnindentListItem(range, nodes, { lastNodeInList: true })) {
    return {
      type: "unindentListItem",
      range,
    };
  }

  if (
    shouldSwitchListItemToParagraph(range, nodes, { listItemIsEmpty: true })
  ) {
    return {
      type: "toggleNodeType",
      nodeType: "paragraph",
      range,
    };
  }

  return {
    type: "insertParagraph",
    newNodeId: uuidv4(),
    range,
  };
}

export function createPasteTextCommand(
  content: string,
  contentType: "plain" | "html",
): Operation | null {
  const range = getSelectionRange();
  if (!range) return null;

  return {
    type: "pasteText",
    content,
    contentType,
    range,
  };
}
