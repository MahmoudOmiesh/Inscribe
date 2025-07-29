import { getSelectionRange } from "../utils/range";
import type { Operation } from "../utils/types";
import { v4 as uuidv4 } from "uuid";

export function createInsertTextCommand(text: string): Operation | null {
  const range = getSelectionRange();
  if (!range) return null;

  return {
    type: "insertText",
    text,
    range,
  };
}

export function createInsertParagraphCommand(): Operation | null {
  const range = getSelectionRange();
  if (!range) return null;

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
