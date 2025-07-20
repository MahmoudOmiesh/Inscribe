import type { EditorNode, InsertTextOperation } from "../types";
import { deleteBetween } from "./helpers/delete-between";

export function insertText(
  nodes: EditorNode[],
  operation: InsertTextOperation,
) {
  const { text, range } = operation;

  const newNodes = range.isCollapsed ? nodes : deleteBetween(nodes, range);

  const nodeIndex = newNodes.findIndex((n) => n.id === range.start.nodeId);
  if (nodeIndex === -1) return newNodes;

  const node = newNodes[nodeIndex]!;
  const newNode = addText({
    node,
    offset: range.start.offset,
    text,
  });

  return [
    ...newNodes.slice(0, nodeIndex),
    newNode,
    ...newNodes.slice(nodeIndex + 1),
  ];
}

function addText({
  node,
  offset,
  text,
}: {
  node: EditorNode;
  offset: number;
  text: string;
}) {
  return {
    ...node,
    text: node.text.slice(0, offset) + text + node.text.slice(offset),
  };
}
