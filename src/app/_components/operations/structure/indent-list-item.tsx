import type {
  EditorNode,
  IndentListItemOperation,
  ListItemNode,
} from "@/app/_components/utils/types";
import { findNodeIndexById, isListItem } from "../shared/node-operations";

const MAX_INDENT_LEVEL = 5;

export function indentListItem(
  nodes: EditorNode[],
  nodeIdIndexMap: Map<string, number>,
  operation: IndentListItemOperation,
) {
  const { range } = operation;

  const firstNodeIndex = findNodeIndexById(nodeIdIndexMap, range.start.nodeId);
  const lastNodeIndex = findNodeIndexById(nodeIdIndexMap, range.end.nodeId);

  if (firstNodeIndex === -1 || lastNodeIndex === -1) {
    return { nodes, newCaretPosition: null };
  }

  const listId = isListItem(nodes[firstNodeIndex]!)
    ? nodes[firstNodeIndex].listId
    : null;

  if (!listId) {
    return { nodes, newCaretPosition: null };
  }

  for (let i = firstNodeIndex + 1; i <= lastNodeIndex; i++) {
    const node = nodes[i]!;
    if (!isListItem(node) || node.listId !== listId) {
      return { nodes, newCaretPosition: null };
    }
  }

  const prevNode = nodes[firstNodeIndex - 1];
  if (
    !prevNode ||
    !isListItem(prevNode) ||
    prevNode.listId !== listId ||
    prevNode.indentLevel < (nodes[firstNodeIndex] as ListItemNode).indentLevel
  ) {
    return { nodes, newCaretPosition: null };
  }

  const newNodes = [...nodes];
  for (let i = firstNodeIndex; i <= lastNodeIndex; i++) {
    const node = newNodes[i]! as ListItemNode;
    newNodes[i] = {
      ...node,
      indentLevel: Math.min(node.indentLevel + 1, MAX_INDENT_LEVEL),
    };
  }

  return {
    nodes: newNodes,
    newCaretPosition: range,
  };
}
