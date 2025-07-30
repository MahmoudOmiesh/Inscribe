import {
  type EditorNode,
  type ToggleNodeAlignmentOperation,
} from "../../utils/types";
import {
  findNodeIndexById,
  updateNodesInRange,
} from "../shared/node-operations";

export function toggleNodeAlignment(
  nodes: EditorNode[],
  operation: ToggleNodeAlignmentOperation,
) {
  const { alignment, range } = operation;

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
      alignment,
    }),
    newCaretPosition: range,
  };
}
