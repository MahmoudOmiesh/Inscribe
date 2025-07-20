import type {
  CaretPosition,
  EditorNode,
  Operation,
  SelectionRange,
} from "../types";

import { getCaretPositionAfterDeleteText } from "./delete-text";
import { getCaretPositionAfterInsertText } from "./insert-text";
import { getCaretPositionAfterMergeNodes } from "./merge-nodes";

export function getCaretPositionAfter(
  nodes: EditorNode[],
  range: SelectionRange,
  operationType: Operation["type"],
): CaretPosition {
  switch (operationType) {
    case "deleteText": {
      return getCaretPositionAfterDeleteText(range);
    }
    case "mergeNodes": {
      return getCaretPositionAfterMergeNodes(nodes, range);
    }
    case "insertText": {
      return getCaretPositionAfterInsertText(range);
    }
    default: {
      return range.end;
    }
  }
}
