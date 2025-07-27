import { adjustMarks, createDeleteChange } from "../utils/adjust-marks";
import type {
  EditorNode,
  DeleteTextBackwardOperation,
  SelectionRange,
  Mark,
  DeleteTextForwardOperation,
} from "../utils/types";
import { deleteBetween } from "./helpers/delete-between";

export function deleteText(
  nodes: EditorNode[],
  activeMarks: Mark["type"][],
  operation: DeleteTextBackwardOperation | DeleteTextForwardOperation,
) {
  const { range } = operation;
  const newCaretPosition = getCaretPositionAfterDeleteText(
    range,
    operation.type === "deleteTextBackward" ? "backward" : "forward",
  );

  if (range.isCollapsed) {
    const nodeIndex = nodes.findIndex((n) => n.id === range.start.nodeId);
    if (nodeIndex === -1) return { nodes, newCaretPosition: null };

    const node = nodes[nodeIndex]!;
    const deletePosition =
      operation.type === "deleteTextBackward"
        ? range.start.offset - 1
        : range.start.offset;

    const newText =
      node.text.slice(0, deletePosition) + node.text.slice(deletePosition + 1);
    const change = createDeleteChange(deletePosition, 1);
    const newMarks = adjustMarks(node.marks, change);

    return {
      nodes: [
        ...nodes.slice(0, nodeIndex),
        {
          ...node,
          text: newText,
          marks: newMarks,
        },
        ...nodes.slice(nodeIndex + 1),
      ],
      newCaretPosition,
    };
  }

  return {
    nodes: deleteBetween(nodes, range),
    newCaretPosition,
  };
}

function getCaretPositionAfterDeleteText(
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
