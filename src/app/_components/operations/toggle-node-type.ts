import { type EditorNode, type ToggleNodeTypeOperation } from "../utils/types";

export function toggleNodeType(
  nodes: EditorNode[],
  operation: ToggleNodeTypeOperation,
) {
  const { nodeType, range } = operation;

  const firstNodeIdx = nodes.findIndex((n) => n.id === range.start.nodeId);
  const lastNodeIdx = nodes.findIndex((n) => n.id === range.end.nodeId);

  if (firstNodeIdx === -1 || lastNodeIdx === -1) {
    return {
      nodes,
      newCaretPosition: range,
    };
  }

  const newNodes = [...nodes];
  for (let i = firstNodeIdx; i <= lastNodeIdx; i++) {
    // new object to force re-render
    // because of memoization
    // TODO: find a better way to do this
    newNodes[i] = {
      ...newNodes[i]!,
      type: nodeType,
    };
  }

  return {
    nodes: newNodes,
    newCaretPosition: range,
  };
}
