import type { EditorNode } from "../../utils/types";
import type { MergeNodesOperation } from "../../utils/types";
import { mergeTwoNodes as mergeNodesHelper } from "../shared/merge-two-nodes";
import {
  findNodeIndexById,
  replaceNodesInRange,
} from "../shared/node-operations";

export function mergeNodes(
  nodes: EditorNode[],
  nodeIdIndexMap: Map<string, number>,
  operation: MergeNodesOperation,
) {
  const { firstNodeId, secondNodeId } = operation;
  const firstNodeIndex = findNodeIndexById(nodeIdIndexMap, firstNodeId);
  const secondNodeIndex = findNodeIndexById(nodeIdIndexMap, secondNodeId);
  if (firstNodeIndex === -1 || secondNodeIndex === -1)
    return { nodes, newCaretPosition: null };

  const firstNode = nodes[firstNodeIndex]!;
  const secondNode = nodes[secondNodeIndex]!;

  const newNode = mergeNodesHelper(firstNode, secondNode);

  return {
    nodes: replaceNodesInRange(nodes, firstNodeIndex, secondNodeIndex, newNode),
    newCaretPosition: getCaretPositionAfterMergeNodes(firstNode),
  };
}

function getCaretPositionAfterMergeNodes(firstNode: EditorNode) {
  return {
    nodeId: firstNode.id,
    offset: firstNode.text.length,
  };
}
