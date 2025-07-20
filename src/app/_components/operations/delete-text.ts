import type { CaretPosition, EditorNode, DeleteTextOperation } from "../types";
import { deleteBetween } from "./helpers/delete-between";

export function deleteText(
  nodes: EditorNode[],
  operation: DeleteTextOperation,
) {
  const { range } = operation;

  if (range.isCollapsed) {
    const nodeIndex = nodes.findIndex((n) => n.id === range.start.nodeId);
    if (nodeIndex === -1) return nodes;

    const node = nodes[nodeIndex]!;
    const newNode = deleteCharacter(node, range.start);
    return [
      ...nodes.slice(0, nodeIndex),
      newNode,
      ...nodes.slice(nodeIndex + 1),
    ];
  }

  return deleteBetween(nodes, range);
}

function deleteCharacter(node: EditorNode, position: CaretPosition) {
  return {
    ...node,
    text:
      node.text.slice(0, position.offset - 1) +
      node.text.slice(position.offset),
  };
}
