import { adjustMarks, createInsertChange } from "../utils/adjust-marks";
import type {
  EditorNode,
  InsertTextOperation,
  Mark,
  SelectionRange,
} from "../utils/types";
import { deleteBetween } from "./helpers/delete-between";
import { mergeOverlappingMarks } from "./helpers/merge-marks";

export function insertText(
  nodes: EditorNode[],
  activeMarks: Mark["type"][],
  operation: InsertTextOperation,
) {
  const { range, text } = operation;

  const newNodes = range.isCollapsed ? nodes : deleteBetween(nodes, range);

  const nodeIndex = newNodes.findIndex((n) => n.id === range.start.nodeId);
  if (nodeIndex === -1) return { nodes, newCaretPosition: null };

  const node = newNodes[nodeIndex]!;
  const newText =
    node.text.slice(0, range.start.offset) +
    text +
    node.text.slice(range.start.offset);

  const change = createInsertChange(range.start.offset, text.length);
  const newMarks = adjustMarks(node.marks, change);
  const newMarksFromActive = activeMarks.map((mark) => ({
    type: mark,
    start: range.start.offset,
    end: range.start.offset + text.length,
  }));

  return {
    nodes: [
      ...newNodes.slice(0, nodeIndex),
      {
        ...node,
        text: newText,
        marks: mergeOverlappingMarks([...newMarks, ...newMarksFromActive]),
      },
      ...newNodes.slice(nodeIndex + 1),
    ],
    newCaretPosition: getCaretPositionAfterInsertText(range, text.length),
  };
}

function getCaretPositionAfterInsertText(
  range: SelectionRange,
  offset: number,
) {
  return {
    ...range.start,
    offset: range.start.offset + offset,
  };
}
