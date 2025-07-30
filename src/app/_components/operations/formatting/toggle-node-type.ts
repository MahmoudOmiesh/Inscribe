import {
  type EditorNode,
  type ToggleNodeTypeOperation,
} from "../../utils/types";
import {
  findNodeIndexById,
  updateNodesInRange,
} from "../shared/node-operations";

export function toggleNodeType(
  nodes: EditorNode[],
  operation: ToggleNodeTypeOperation,
) {
  const { nodeType, range } = operation;

  const firstNodeIdx = findNodeIndexById(nodes, range.start.nodeId);
  const lastNodeIdx = findNodeIndexById(nodes, range.end.nodeId);

  if (firstNodeIdx === -1 || lastNodeIdx === -1) {
    return {
      nodes,
      newCaretPosition: range,
    };
  }

  return {
    nodes: updateNodesInRange(nodes, firstNodeIdx, lastNodeIdx, {
      type: nodeType,
    }),
    newCaretPosition: range,
  };
}
