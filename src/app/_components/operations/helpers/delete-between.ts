import type { EditorNode, SelectionRange } from "../../types";

export function deleteBetween(
  nodes: EditorNode[],
  range: SelectionRange,
): EditorNode[] {
  const startNodeIndex = nodes.findIndex((n) => n.id === range.start.nodeId);
  const endNodeIndex = nodes.findIndex((n) => n.id === range.end.nodeId);

  if (startNodeIndex === -1 || endNodeIndex === -1) return nodes;

  if (startNodeIndex === endNodeIndex) {
    // Delete within same node
    const node = nodes[startNodeIndex]!;
    const newText =
      node.text.slice(0, range.start.offset) +
      node.text.slice(range.end.offset);

    return [
      ...nodes.slice(0, startNodeIndex),
      { ...node, text: newText },
      ...nodes.slice(startNodeIndex + 1),
    ];
  }

  // Delete across multiple nodes
  const startNode = nodes[startNodeIndex]!;
  const endNode = nodes[endNodeIndex]!;

  const mergedNode = {
    ...startNode,
    text:
      startNode.text.slice(0, range.start.offset) +
      endNode.text.slice(range.end.offset),
  };

  return [
    ...nodes.slice(0, startNodeIndex),
    mergedNode,
    ...nodes.slice(endNodeIndex + 1),
  ];
}
