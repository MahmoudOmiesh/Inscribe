import type {
  EditorNode,
  Mark,
  Operation,
  OperationResult,
} from "../utils/types";
import { insertText } from "./insert-text";
import { deleteText } from "./delete-text";
import { mergeNodes } from "./merge-nodes";
import { insertParagraph } from "./insert-paragraph";
import { insertReplacementText } from "./insert-replacement-text";
import { toggleMark } from "./toggle-mark";
import { deleteWord } from "./delete-word";
import { pasteText } from "./paste-text";
import { deleteByCut } from "./delete-by-cut";
import { toggleNodeType } from "./toggle-node-type";

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
    case "deleteWordBackward": {
      return deleteWord(nodes, activeMarks, operation);
    }
    case "deleteWordForward": {
      return deleteWord(nodes, activeMarks, operation);
    }
    case "deleteByCut": {
      return deleteByCut(nodes, activeMarks, operation);
    }
    case "pasteText": {
      return pasteText(nodes, activeMarks, operation);
    }
    case "toggleNodeType": {
      return toggleNodeType(nodes, operation);
    }
    default: {
      const _exhaustiveCheck: never = operation;
      return _exhaustiveCheck;
    }
  }
}
