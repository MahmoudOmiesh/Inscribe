import type {
  EditorNode,
  InsertParagraphOperation,
  Mark,
} from "../utils/types";
import { deleteBetween } from "./helpers/delete-between";
import { splitNode } from "./helpers/split-node";

export function insertParagraph(
  nodes: EditorNode[],
  activeMarks: Mark["type"][],
  operation: InsertParagraphOperation,
) {
  const { range, newNodeId } = operation;

  const newNodes = range.isCollapsed ? nodes : deleteBetween(nodes, range);
  const nodeIndex = newNodes.findIndex((n) => n.id === range.start.nodeId);
  if (nodeIndex === -1) return { nodes, newCaretPosition: null };

  const node = newNodes[nodeIndex]!;
  const [left, right] = splitNode({
    node,
    offset: range.start.offset,
    newNodeId,
  });

  if (right.text.length === 0) {
    right.type = "paragraph";
    right.marks = [];
  }

  return {
    nodes: [
      ...newNodes.slice(0, nodeIndex),
      left,
      right,
      ...newNodes.slice(nodeIndex + 1),
    ],
    newCaretPosition: getCaretPositionAfterInsertParagraph(newNodeId),
  };
}

function getCaretPositionAfterInsertParagraph(newNodeId: string) {
  return {
    nodeId: newNodeId,
    offset: 0,
  };
}
