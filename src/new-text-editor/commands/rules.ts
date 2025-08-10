import { isListItem } from "../model/lists";
import type { EditorNode } from "../model/schema";
import type { SelectionRange } from "../model/selection";

const findIndex = (nodeIdIndex: Map<string, number>, nodeId: string) => {
  const index = nodeIdIndex.get(nodeId);
  if (index === undefined) return -1;
  return index;
};

export function shouldMergeBackward(range: SelectionRange) {
  return isCollapsedAtStart(range);
}

export function shouldMergeForward(
  nodes: EditorNode[],
  nodeIdIndex: Map<string, number>,
  range: SelectionRange,
) {
  return isCollapsedAtEnd(nodes, nodeIdIndex, range);
}

export function shouldOutdentOnBackspace(
  nodes: EditorNode[],
  nodeIdIndex: Map<string, number>,
  range: SelectionRange,
) {
  if (!range.isCollapsed) return false;
  const index = findIndex(nodeIdIndex, range.start.nodeId);
  if (index === -1) return false;
  const node = nodes[index]!;
  return (
    isListItem(node) && isEmptyListItem(nodes, index) && node.indentLevel > 0
  );
}

export function shouldOutdentOnEnter(
  nodes: EditorNode[],
  nodeIdIndex: Map<string, number>,
  range: SelectionRange,
) {
  if (!range.isCollapsed) return false;
  const index = findIndex(nodeIdIndex, range.start.nodeId);
  if (index === -1) return false;
  const node = nodes[index]!;
  return (
    isListItem(node) &&
    isLastItemInList(nodes, index) &&
    isEmptyListItem(nodes, index) &&
    node.indentLevel > 0
  );
}

export function shouldSwitchListItemToParagraph(
  nodes: EditorNode[],
  nodeIdIndex: Map<string, number>,
  range: SelectionRange,
) {
  if (!range.isCollapsed) return false;
  const index = findIndex(nodeIdIndex, range.start.nodeId);
  if (index === -1) return false;

  const node = nodes[index]!;
  return (
    isListItem(node) &&
    isLastItemInList(nodes, index) &&
    isEmptyListItem(nodes, index) &&
    node.indentLevel === 0
  );
}

export function findAdjacentNodes(
  nodes: EditorNode[],
  nodeIdIndex: Map<string, number>,
  nodeId: string,
  direction: "forward" | "backward",
): [string, string] | null {
  const index = findIndex(nodeIdIndex, nodeId);
  if (index === -1) return null;

  if (direction === "backward" && index > 0) {
    return [nodes[index - 1]!.id, nodeId];
  }

  if (direction === "forward" && index < nodes.length - 1) {
    return [nodeId, nodes[index + 1]!.id];
  }

  return null;
}

function isEmptyListItem(nodes: EditorNode[], index: number) {
  const node = nodes[index]!;
  return isListItem(node) && node.text.length === 0;
}

function isLastItemInList(nodes: EditorNode[], index: number) {
  const node = nodes[index]!;
  if (!isListItem(node)) return false;

  const next = nodes[index + 1];
  return !next || !isListItem(next) || next.listId !== node.listId;
}

function isCollapsedAtStart(range: SelectionRange) {
  return range.isCollapsed && range.start.offset === 0;
}

function isCollapsedAtEnd(
  nodes: EditorNode[],
  nodeIdIndex: Map<string, number>,
  range: SelectionRange,
) {
  if (!range.isCollapsed) return false;
  const index = findIndex(nodeIdIndex, range.start.nodeId);
  if (index === -1) return false;
  return index !== -1 && range.start.offset === nodes[index]!.text.length;
}
