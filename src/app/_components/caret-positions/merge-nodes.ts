import type { EditorNode, SelectionRange } from "../types";

export function getCaretPositionAfterMergeNodes(
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
