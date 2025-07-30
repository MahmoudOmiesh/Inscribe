import { adjustMarks, createDeleteChange } from "../../utils/adjust-marks";
import type { EditorNode, SelectionRange } from "../../utils/types";
import { mergeTwoNodes } from "./merge-two-nodes";
import {
  findNodeIndexById,
  replaceNodeAtIndex,
  replaceNodesInRange,
} from "./node-operations";

export function deleteBetween(nodes: EditorNode[], range: SelectionRange) {
  const startNodeIndex = findNodeIndexById(nodes, range.start.nodeId);
  const endNodeIndex = findNodeIndexById(nodes, range.end.nodeId);

  if (startNodeIndex === -1 || endNodeIndex === -1) return nodes;

  if (startNodeIndex === endNodeIndex) {
    // Delete within same node
    const node = nodes[startNodeIndex]!;
    const newNode = deleteTextInNode(
      node,
      range.start.offset,
      range.end.offset,
    );

    return replaceNodeAtIndex(nodes, startNodeIndex, newNode);
  }

  // Delete across multiple nodes
  const startNode = nodes[startNodeIndex]!;
  const endNode = nodes[endNodeIndex]!;

  const newStartNode = deleteTextInNode(
    startNode,
    range.start.offset,
    startNode.text.length,
  );
  const newEndNode = deleteTextInNode(endNode, 0, range.end.offset);

  const mergedNode = mergeTwoNodes(newStartNode, newEndNode);

  return replaceNodesInRange(nodes, startNodeIndex, endNodeIndex, mergedNode);
}

function deleteTextInNode(
  node: EditorNode,
  startOffset: number,
  endOffset: number,
) {
  const deletedLength = endOffset - startOffset;

  const newText = node.text.slice(0, startOffset) + node.text.slice(endOffset);

  const change = createDeleteChange(startOffset, deletedLength);
  const newMarks = adjustMarks(node.marks, change);

  return {
    ...node,
    text: newText,
    marks: newMarks,
  };
}
