import { adjustMarks, createDeleteChange } from "../utils/adjust-marks";
import type {
  EditorNode,
  DeleteTextOperation,
  SelectionRange,
  Mark,
} from "../utils/types";
import { deleteBetween } from "./helpers/delete-between";

export function deleteText(
  nodes: EditorNode[],
  activeMarks: Mark["type"][],
  operation: DeleteTextOperation,
) {
  const { range } = operation;
  const newCaretPosition = getCaretPositionAfterDeleteText(range);

  if (range.isCollapsed) {
    const nodeIndex = nodes.findIndex((n) => n.id === range.start.nodeId);
    if (nodeIndex === -1) return { nodes, newCaretPosition: null };

    const node = nodes[nodeIndex]!;
    const deletePosition = range.start.offset - 1;

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

function getCaretPositionAfterDeleteText(range: SelectionRange) {
  return {
    ...range.start,
    offset: Math.max(
      range.isCollapsed ? range.start.offset - 1 : range.start.offset,
      0,
    ),
  };
}
