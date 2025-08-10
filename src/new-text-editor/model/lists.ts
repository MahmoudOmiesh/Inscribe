import type { EditorNode, ListItemNode } from "./schema";

const MAX_INDENT_LEVEL = 5;

export function isListItem(node: EditorNode) {
  return (
    node.type === "unordered-list-item" ||
    node.type === "ordered-list-item" ||
    node.type === "check-list-item"
  );
}

export function isInSameList(firstNode: EditorNode, secondNode: EditorNode) {
  return (
    isListItem(firstNode) &&
    isListItem(secondNode) &&
    firstNode.listId === secondNode.listId
  );
}

export function getListBoundaries(nodes: EditorNode[], idx: number) {
  const node = nodes[idx];
  if (!node || !isListItem(node)) return null;

  let start = idx;
  let end = idx;

  while (start > 0 && isInSameList(nodes[start - 1]!, node)) {
    start--;
  }

  while (end < nodes.length - 1 && isInSameList(node, nodes[end + 1]!)) {
    end++;
  }

  return { start, end };
}

// Clamp indents in a list group to prevIndent + 1
// range is assumed to be a single contiguous list group
export function clampIndentsInGroup(
  nodes: EditorNode[],
  start: number,
  end: number,
) {
  let prevIndent = -1;

  for (let i = start; i <= end; i++) {
    const node = nodes[i]! as ListItemNode;
    node.indentLevel = Math.min(node.indentLevel, prevIndent + 1);
    node.indentLevel = Math.min(node.indentLevel, MAX_INDENT_LEVEL);
    node.indentLevel = Math.max(node.indentLevel, 0);
    prevIndent = node.indentLevel;
  }
}
