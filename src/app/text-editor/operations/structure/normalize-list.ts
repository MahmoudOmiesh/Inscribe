import type { EditorNode, ListItemNode } from "../../utils/types";
import { isListItem } from "../shared/node-operations";

export function normalizeList(nodes: EditorNode[]) {
  const result: EditorNode[] = [];

  for (const node of nodes) {
    if (!isListItem(node)) {
      result.push(node);
      continue;
    }

    const normalizedListItem = normalizeListItem(node, result);
    result.push(normalizedListItem);
  }

  return result;
}

function normalizeListItem(
  listItem: ListItemNode,
  processedNodes: EditorNode[],
) {
  const maxValidIndent = getMaxValidIndent(listItem.listId, processedNodes);

  const normalizedIndent = Math.min(listItem.indentLevel, maxValidIndent + 1);

  return {
    ...listItem,
    indentLevel: normalizedIndent,
  };
}

function getMaxValidIndent(listId: string, processedNodes: EditorNode[]) {
  for (let i = processedNodes.length - 1; i >= 0; i--) {
    const node = processedNodes[i]!;

    if (isListItem(node) && node.listId === listId) {
      return node.indentLevel;
    }

    if (!isListItem(node) || node.listId !== listId) {
      break;
    }
  }

  return -1;
}
