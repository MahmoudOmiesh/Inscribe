import type {
  EditorNode,
  Mark,
  Operation,
  OperationResult,
} from "../utils/types";
import { insertText } from "./text/insert-text";
import { deleteText } from "./text/delete-text";
import { mergeNodes } from "./structure/merge-nodes";
import { insertParagraph } from "./structure/insert-paragraph";
import { toggleMark } from "./formatting/toggle-mark";
import { deleteWord } from "./text/delete-word";
import { pasteText } from "./text/paste-text";
import { deleteByCut } from "./structure/delete-by-cut";
import { toggleNodeType } from "./formatting/toggle-node-type";
import { toggleNodeAlignment } from "./formatting/toggle-node-alignment";

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
      return deleteText(nodes, operation);
    }
    case "deleteTextForward": {
      return deleteText(nodes, operation);
    }
    case "mergeNodes": {
      return mergeNodes(nodes, operation);
    }
    case "insertParagraph": {
      return insertParagraph(nodes, operation);
    }
    case "toggleMark": {
      return toggleMark(nodes, activeMarks, operation);
    }
    case "deleteWordBackward": {
      return deleteWord(nodes, operation);
    }
    case "deleteWordForward": {
      return deleteWord(nodes, operation);
    }
    case "deleteByCut": {
      return deleteByCut(nodes, operation);
    }
    case "pasteText": {
      return pasteText(nodes, activeMarks, operation);
    }
    case "toggleNodeType": {
      return toggleNodeType(nodes, operation);
    }
    case "toggleNodeAlignment": {
      return toggleNodeAlignment(nodes, operation);
    }
    default: {
      const _exhaustiveCheck: never = operation;
      return _exhaustiveCheck;
    }
  }
}
