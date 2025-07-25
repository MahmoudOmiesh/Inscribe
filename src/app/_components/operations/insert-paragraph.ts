import { adjustMarks, createDeleteChange } from "../utils/marks";
import type {
  EditorNode,
  InsertParagraphOperation,
  Mark,
} from "../utils/types";
import { deleteBetween } from "./helpers/delete-between";

export function insertParagraph(
  nodes: EditorNode[],
  activeMarks: Mark["type"][],
  operation: InsertParagraphOperation,
) {
  const { range, newNodeId } = operation;

  const newNodes = range.isCollapsed
    ? nodes
    : deleteBetween(nodes, activeMarks, range);
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

function splitNode({
  node,
  offset,
  newNodeId,
}: {
  node: EditorNode;
  offset: number;
  newNodeId: string;
}) {
  const leftChange = createDeleteChange(offset, node.text.length - offset);
  const leftMarks = adjustMarks(node.marks, leftChange);
  const left: EditorNode = {
    ...node,
    text: node.text.slice(0, offset),
    marks: leftMarks,
  };

  const rightChange = createDeleteChange(0, offset);
  const rightMarks = adjustMarks(node.marks, rightChange);
  const right: EditorNode = {
    ...node,
    id: newNodeId,
    text: node.text.slice(offset),
    marks: rightMarks,
  };

  return [left, right] as const;
}

function getCaretPositionAfterInsertParagraph(newNodeId: string) {
  return {
    nodeId: newNodeId,
    offset: 0,
  };
}
