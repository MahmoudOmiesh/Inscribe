import { adjustMarks, createDeleteChange } from "../../utils/adjust-marks";
import type {
  EditorNode,
  DeleteTextBackwardOperation,
  SelectionRange,
  DeleteTextForwardOperation,
} from "../../utils/types";
import { deleteBetween } from "../shared/delete-between";
import {
  findNodeIndexById,
  replaceNodeAtIndex,
} from "../shared/node-operations";

export function deleteText(
  nodes: EditorNode[],
  nodeIdIndexMap: Map<string, number>,
  operation: DeleteTextBackwardOperation | DeleteTextForwardOperation,
) {
  const { range } = operation;
  const newCaretPosition = getNewCaretPosition(
    range,
    operation.type === "deleteTextBackward" ? "backward" : "forward",
  );

  if (range.isCollapsed) {
    const nodeIndex = findNodeIndexById(nodeIdIndexMap, range.start.nodeId);
    if (nodeIndex === -1) return { nodes, newCaretPosition: null };

    const node = nodes[nodeIndex]!;
    const newNode = deleteTextInNode(node, operation);

    return {
      nodes: replaceNodeAtIndex(nodes, nodeIndex, newNode),
      newCaretPosition,
    };
  }

  return {
    nodes: deleteBetween(nodes, nodeIdIndexMap, range),
    newCaretPosition,
  };
}

function deleteTextInNode(
  node: EditorNode,
  operation: DeleteTextBackwardOperation | DeleteTextForwardOperation,
) {
  const { range } = operation;
  const deletePosition =
    operation.type === "deleteTextBackward"
      ? range.start.offset - 1
      : range.start.offset;

  const newText =
    node.text.slice(0, deletePosition) + node.text.slice(deletePosition + 1);
  const change = createDeleteChange(deletePosition, 1);
  const newMarks = adjustMarks(node.marks, change);

  return {
    ...node,
    text: newText,
    marks: newMarks,
  };
}

function getNewCaretPosition(
  range: SelectionRange,
  direction: "backward" | "forward",
) {
  return {
    ...range.start,
    offset: Math.max(
      range.isCollapsed
        ? range.start.offset - (direction === "backward" ? 1 : 0)
        : range.start.offset,
      0,
    ),
  };
}
