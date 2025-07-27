import { adjustMarks, createInsertChange } from "../utils/adjust-marks";
import type { EditorNode, Mark } from "../utils/types";
import type { MergeNodesOperation } from "../utils/types";

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

  const secondNodeChange = createInsertChange(0, firstNode.text.length);
  const secondNodeMarks = adjustMarks(secondNode.marks, secondNodeChange);
  const newNode = {
    ...firstNode,
    text: firstNode.text + secondNode.text,
    marks: [...firstNode.marks, ...secondNodeMarks],
  };

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
