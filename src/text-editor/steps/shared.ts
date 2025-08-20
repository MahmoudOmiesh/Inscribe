import { adjustMarks } from "../model/marks";
import type { EditorNode } from "../model/schema";
import type { SelectionRange } from "../model/selection";

export function findNodeIndex(nodeIdIndexMap: Map<string, number>, id: string) {
  const index = nodeIdIndexMap.get(id);
  return index ?? -1;
}

export function replaceNodeAtIndex<T extends EditorNode>(
  nodes: T[],
  index: number,
  newNode: T | T[],
) {
  return [
    ...nodes.slice(0, index),
    ...(Array.isArray(newNode) ? newNode : [newNode]),
    ...nodes.slice(index + 1),
  ];
}

export function replaceNodesInRange<T extends EditorNode>(
  nodes: T[],
  startIndex: number,
  endIndex: number,
  newNodes: T | T[],
) {
  return [
    ...nodes.slice(0, startIndex),
    ...(Array.isArray(newNodes) ? newNodes : [newNodes]),
    ...nodes.slice(endIndex + 1),
  ];
}

export function mergeTwoNodes(firstNode: EditorNode, secondNode: EditorNode) {
  if (firstNode.type === "separator") return secondNode;

  const secondNodeMarks = adjustMarks(secondNode.marks, {
    offset: 0,
    deletedLength: 0,
    insertedLength: firstNode.text.length,
  });

  const newNode = {
    ...firstNode,
    text: firstNode.text + secondNode.text,
    marks: [...firstNode.marks, ...secondNodeMarks],
  };

  return newNode;
}

export function splitNode({
  node,
  offset,
  newNodeId,
}: {
  node: EditorNode;
  offset: number;
  newNodeId: string;
}) {
  const leftMarks = adjustMarks(node.marks, {
    offset,
    deletedLength: node.text.length - offset,
    insertedLength: 0,
  });
  const left: EditorNode = {
    ...node,
    text: node.text.slice(0, offset),
    marks: leftMarks,
  };

  const rightMarks = adjustMarks(node.marks, {
    offset: 0,
    deletedLength: offset,
    insertedLength: 0,
  });
  const right: EditorNode = {
    ...node,
    id: newNodeId,
    text: node.text.slice(offset),
    marks: rightMarks,
  };

  return [left, right] as const;
}

export function deleteBetween(
  nodes: EditorNode[],
  nodeIdIndexMap: Map<string, number>,
  range: SelectionRange,
) {
  const startNodeIndex = findNodeIndex(nodeIdIndexMap, range.start.nodeId);
  const endNodeIndex = findNodeIndex(nodeIdIndexMap, range.end.nodeId);

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
  const newMarks = adjustMarks(node.marks, {
    offset: startOffset,
    deletedLength,
    insertedLength: 0,
  });

  return {
    ...node,
    text: newText,
    marks: newMarks,
  };
}
