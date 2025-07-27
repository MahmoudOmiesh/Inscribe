import type {
  EditorNode,
  Mark,
  Operation,
  OperationResult,
} from "../utils/types";
import { insertText } from "./insert-text";
import { deleteText } from "./delete-text-backward";
import { mergeNodes } from "./merge-nodes";
import { insertParagraph } from "./insert-paragraph";
import { insertReplacementText } from "./insert-replacement-text";
import { toggleMark } from "./toggle-mark";

export function applyOperation(
  nodes: EditorNode[],
  activeMarks: Mark["type"][],
  operation: Operation,
): OperationResult {
  switch (operation.type) {
    case "insertText": {
      return insertText(nodes, activeMarks, operation);
    }
    case "deleteTextBackward": {
      return deleteText(nodes, activeMarks, operation);
    }
    case "deleteTextForward": {
      return deleteText(nodes, activeMarks, operation);
    }
    case "mergeNodes": {
      return mergeNodes(nodes, activeMarks, operation);
    }
    case "insertParagraph": {
      return insertParagraph(nodes, activeMarks, operation);
    }
    case "toggleMark": {
      return toggleMark(nodes, activeMarks, operation);
    }
    case "insertReplacementText": {
      return insertReplacementText(nodes, operation);
    }
  }
}
