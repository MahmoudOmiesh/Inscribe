import type { EditorNode, InsertParagraphOperation } from "../types";
import { deleteBetween } from "./helpers/delete-between";

export function insertParagraph(
  nodes: EditorNode[],
  operation: InsertParagraphOperation,
) {
  const { range, newNodeId } = operation;

  const newNodes = range.isCollapsed ? nodes : deleteBetween(nodes, range);
  const nodeIndex = newNodes.findIndex((n) => n.id === range.start.nodeId);
  if (nodeIndex === -1) return newNodes;

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

  return [
    ...newNodes.slice(0, nodeIndex),
    left,
    right,
    ...newNodes.slice(nodeIndex + 1),
  ];
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
  const left: EditorNode = {
    ...node,
    text: node.text.slice(0, offset),
  };

  const right: EditorNode = {
    ...node,
    id: newNodeId,
    text: node.text.slice(offset),
  };

  return [left, right] as const;
}
