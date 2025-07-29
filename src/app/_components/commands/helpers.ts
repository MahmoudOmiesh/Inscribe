import type { EditorNode, SelectionRange } from "../utils/types";

export function shouldMergeNodesBackward(range: SelectionRange) {
  return range.isCollapsed && range.start.offset === 0;
}

export function shouldMergeNodesForward(
  range: SelectionRange,
  nodes: EditorNode[],
) {
  if (!range.isCollapsed) return false;

  const nodeIdx = nodes.findIndex((n) => n.id === range.start.nodeId);

  return nodeIdx !== -1 && range.start.offset === nodes[nodeIdx]!.text.length;
}

export function findAdjacentNodes(
  nodes: EditorNode[],
  nodeId: string,
  direction: "forward" | "backward",
): [string, string] | null {
  const nodeIdx = nodes.findIndex((n) => n.id === nodeId);

  if (direction === "backward" && nodeIdx > 0) {
    return [nodes[nodeIdx - 1]!.id, nodeId];
  }

  if (direction === "forward" && nodeIdx < nodes.length - 1) {
    return [nodeId, nodes[nodeIdx + 1]!.id];
  }

  return null;
}
