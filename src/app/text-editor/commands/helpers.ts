import { isListItem } from "../operations/shared/node-operations";
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

export function shouldUnindentListItem(
  range: SelectionRange,
  nodes: EditorNode[],
  { lastNodeInList }: { lastNodeInList: boolean } = {
    lastNodeInList: false,
  },
) {
  if (!range.isCollapsed) return false;

  const nodeIdx = nodes.findIndex((n) => n.id === range.start.nodeId);
  if (nodeIdx === -1) return false;

  const node = nodes[nodeIdx]!;

  if (lastNodeInList) {
    const nextNode = nodes[nodeIdx + 1];
    const nextNodeListId =
      nextNode && isListItem(nextNode) ? nextNode.listId : null;

    return (
      isListItem(node) &&
      range.start.offset === 0 &&
      node.text.length === 0 &&
      node.indentLevel > 0 &&
      nextNodeListId !== node.listId
    );
  }

  return isListItem(node) && node.indentLevel > 0 && range.start.offset === 0;
}

export function shouldSwitchListItemToParagraph(
  range: SelectionRange,
  nodes: EditorNode[],
  { listItemIsEmpty }: { listItemIsEmpty: boolean } = {
    listItemIsEmpty: false,
  },
) {
  const nodeIdx = nodes.findIndex((n) => n.id === range.start.nodeId);
  if (nodeIdx === -1) return false;

  const node = nodes[nodeIdx]!;
  const nextNode = nodes[nodeIdx + 1];
  const nextNodeListId =
    nextNode && isListItem(nextNode) ? nextNode.listId : null;

  return (
    range.isCollapsed &&
    isListItem(node) &&
    node.indentLevel === 0 &&
    nextNodeListId !== node.listId &&
    (listItemIsEmpty ? node.text.length === 0 : true)
  );
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
