import {
  type EditorNode,
  type ToggleNodeTypeOperation,
} from "../../utils/types";
import {
  findNodeIndexById,
  updateNodesInRange,
} from "../shared/node-operations";
import { v4 as uuidv4 } from "uuid";

export function toggleNodeType(
  nodes: EditorNode[],
  nodeIdIndexMap: Map<string, number>,
  operation: ToggleNodeTypeOperation,
) {
  const { nodeType, range } = operation;

  const firstNodeIdx = findNodeIndexById(nodeIdIndexMap, range.start.nodeId);
  const lastNodeIdx = findNodeIndexById(nodeIdIndexMap, range.end.nodeId);

  if (firstNodeIdx === -1 || lastNodeIdx === -1) {
    return {
      nodes,
      newCaretPosition: range,
    };
  }

  if (nodeType === "unordered-list-item" || nodeType === "ordered-list-item") {
    const listId = uuidv4();

    return {
      nodes: updateNodesInRange(nodes, firstNodeIdx, lastNodeIdx, {
        type: nodeType,
        listId,
      }),
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
