import type { EditorNode, UnindentListItemOperation } from "../../utils/types";
import { findNodeIndexById, isListItem } from "../shared/node-operations";

export function unindentListItem(
  nodes: EditorNode[],
  nodeIdIndexMap: Map<string, number>,
  operation: UnindentListItemOperation,
) {
  const { range } = operation;

  const firstNodeIndex = findNodeIndexById(nodeIdIndexMap, range.start.nodeId);
  const lastNodeIndex = findNodeIndexById(nodeIdIndexMap, range.end.nodeId);

  if (firstNodeIndex === -1 || lastNodeIndex === -1) {
    return { nodes, newCaretPosition: null };
  }

  const firstNode = nodes[firstNodeIndex]!;
  if (!isListItem(firstNode)) {
    return { nodes, newCaretPosition: null };
  }

  const listId = firstNode.listId;
  const indentLevel = firstNode.indentLevel;

  if (indentLevel === 0) {
    return { nodes, newCaretPosition: null };
  }

  for (let i = firstNodeIndex + 1; i <= lastNodeIndex; i++) {
    const node = nodes[i]!;
    if (!isListItem(node) || node.listId !== listId) {
      return { nodes, newCaretPosition: null };
    }
  }

  const newNodes = [...nodes];

  for (let i = firstNodeIndex; i < nodes.length; i++) {
    const node = nodes[i]!;
    if (
      !isListItem(node) ||
      node.listId !== listId ||
      node.indentLevel < indentLevel
    ) {
      break;
    }

    newNodes[i] = {
      ...node,
      indentLevel: node.indentLevel - 1,
    };
  }

  return {
    nodes: newNodes,
    newCaretPosition: range,
  };
}
