import type { EditorNode, Mark } from "../utils/types";
import type { MergeNodesOperation } from "../utils/types";
import { mergeNodes as mergeNodesHelper } from "./helpers/marge-nodes";

export function mergeNodes(
  nodes: EditorNode[],
  activeMarks: Mark["type"][],
  operation: MergeNodesOperation,
) {
  const { firstNodeId, secondNodeId } = operation;
  const firstNodeIndex = nodes.findIndex((n) => n.id === firstNodeId);
  const secondNodeIndex = nodes.findIndex((n) => n.id === secondNodeId);
  if (firstNodeIndex === -1 || secondNodeIndex === -1)
    return { nodes, newCaretPosition: null };

  const firstNode = nodes[firstNodeIndex]!;
  const secondNode = nodes[secondNodeIndex]!;

  const newNode = mergeNodesHelper(firstNode, secondNode);

  return {
    nodes: [
      ...nodes.slice(0, firstNodeIndex),
      newNode,
      ...nodes.slice(secondNodeIndex + 1),
    ],
    newCaretPosition: getCaretPositionAfterMergeNodes(firstNode),
  };
}

function getCaretPositionAfterMergeNodes(firstNode: EditorNode) {
  return {
    nodeId: firstNode.id,
    offset: firstNode.text.length,
  };
}
