import type { EditorNode, Operation } from "../types";
import { insertText } from "./insert-text";
import { deleteText } from "./delete-text";
import { mergeNodes } from "./merge-nodes";
import { insertParagraph } from "./insert-paragraph";

export function applyOperation(nodes: EditorNode[], operation: Operation) {
  switch (operation.type) {
    case "insertText": {
      return insertText(nodes, operation);
    }
    case "deleteText": {
      return deleteText(nodes, operation);
    }
    case "mergeNodes": {
      return mergeNodes(nodes, operation);
    }
    case "insertParagraph": {
      return insertParagraph(nodes, operation);
    }
  }
}
