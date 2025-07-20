import type { EditorNode } from "../types";
import type { MergeNodesOperation } from "../types";

export function mergeNodes(
  nodes: EditorNode[],
  operation: MergeNodesOperation,
) {
  const { firstNodeId, secondNodeId } = operation;
  const firstNodeIndex = nodes.findIndex((n) => n.id === firstNodeId);
  const secondNodeIndex = nodes.findIndex((n) => n.id === secondNodeId);
  if (firstNodeIndex === -1 || secondNodeIndex === -1) return nodes;

  const firstNode = nodes[firstNodeIndex]!;
  const secondNode = nodes[secondNodeIndex]!;
  const newNode = {
    ...firstNode,
    text: firstNode.text + secondNode.text,
  };

  return [
    ...nodes.slice(0, firstNodeIndex),
    newNode,
    ...nodes.slice(secondNodeIndex + 1),
  ];
}
