import { adjustMarks, createInsertChange } from "../utils/adjust-marks";
import type { EditorNode, Mark, SelectionRange } from "../utils/types";
import type { MergeNodesOperation } from "../utils/types";

export function mergeNodes(
  nodes: EditorNode[],
  activeMarks: Mark["type"][],
  operation: MergeNodesOperation,
) {
  const { firstNodeId, secondNodeId, range } = operation;
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
    newCaretPosition: getCaretPositionAfterMergeNodes(nodes, range),
  };
}

function getCaretPositionAfterMergeNodes(
  nodes: EditorNode[],
  range: SelectionRange,
) {
  const nodeIdx = nodes.findIndex((n) => n.id === range.start.nodeId);
  if (nodeIdx === -1 || nodeIdx === 0) return range.start;

  const prevNode = nodes[nodeIdx - 1]!;

  return {
    nodeId: prevNode.id,
    offset: prevNode.text.length,
  };
}
