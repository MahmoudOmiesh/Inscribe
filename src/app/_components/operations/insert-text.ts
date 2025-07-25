import { adjustMarks, createInsertChange } from "../utils/marks";
import type {
  EditorNode,
  InsertTextOperation,
  Mark,
  SelectionRange,
} from "../utils/types";
import { deleteBetween } from "./helpers/delete-between";

export function insertText(
  nodes: EditorNode[],
  activeMarks: Mark["type"][],
  operation: InsertTextOperation,
) {
  const { range, text } = operation;

  const newNodes = range.isCollapsed
    ? nodes
    : deleteBetween(nodes, activeMarks, range);

  const nodeIndex = newNodes.findIndex((n) => n.id === range.start.nodeId);
  if (nodeIndex === -1) return { nodes, newCaretPosition: null };

  const node = newNodes[nodeIndex]!;
  const newText =
    node.text.slice(0, range.start.offset) +
    text +
    node.text.slice(range.start.offset);

  const change = createInsertChange(range.start.offset, text.length);
  const newMarks = adjustMarks(node.marks, change);

  return {
    nodes: [
      ...newNodes.slice(0, nodeIndex),
      {
        ...node,
        text: newText,
        marks: newMarks,
      },
      ...newNodes.slice(nodeIndex + 1),
    ],
    newCaretPosition: getCaretPositionAfterInsertText(range),
  };
}

function getCaretPositionAfterInsertText(range: SelectionRange) {
  return {
    ...range.start,
    offset: range.start.offset + 1,
  };
}
