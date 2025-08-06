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
import { indentListItem } from "./structure/indent-list-item";
import { unindentListItem } from "./structure/unindent-list-item";

export function applyOperation(
  nodes: EditorNode[],
  nodeIdIndexMap: Map<string, number>,
  activeMarks: Mark["type"][],
  operation: Operation,
): OperationResult {
  switch (operation.type) {
    case "insertText": {
      return insertText(nodes, nodeIdIndexMap, activeMarks, operation);
    }
    case "deleteTextBackward": {
      return deleteText(nodes, nodeIdIndexMap, operation);
    }
    case "deleteTextForward": {
      return deleteText(nodes, nodeIdIndexMap, operation);
    }
    case "mergeNodes": {
      return mergeNodes(nodes, nodeIdIndexMap, operation);
    }
    case "insertParagraph": {
      return insertParagraph(nodes, nodeIdIndexMap, operation);
    }
    case "toggleMark": {
      return toggleMark(nodes, nodeIdIndexMap, activeMarks, operation);
    }
    case "deleteWordBackward": {
      return deleteWord(nodes, nodeIdIndexMap, operation);
    }
    case "deleteWordForward": {
      return deleteWord(nodes, nodeIdIndexMap, operation);
    }
    case "deleteByCut": {
      return deleteByCut(nodes, nodeIdIndexMap, operation);
    }
    case "pasteText": {
      return pasteText(nodes, nodeIdIndexMap, activeMarks, operation);
    }
    case "toggleNodeType": {
      return toggleNodeType(nodes, nodeIdIndexMap, operation);
    }
    case "toggleNodeAlignment": {
      return toggleNodeAlignment(nodes, nodeIdIndexMap, operation);
    }
    case "indentListItem": {
      return indentListItem(nodes, nodeIdIndexMap, operation);
    }
    case "unindentListItem": {
      return unindentListItem(nodes, nodeIdIndexMap, operation);
    }
    default: {
      const _exhaustiveCheck: never = operation;
      return _exhaustiveCheck;
    }
  }
}
