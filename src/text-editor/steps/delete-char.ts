import { adjustMarks } from "../model/marks";
import type { EditorNode } from "../model/schema";
import type { EditorState } from "../state/editor-state";
import type { Step } from "../state/transaction";
import { deleteBetween, findNodeIndex, replaceNodeAtIndex } from "./shared";

export function deleteCharStep(direction: "backward" | "forward"): Step {
  return (state: EditorState) => {
    const { nodes, nodeIdIndex, selection } = state;

    if (!selection.isCollapsed) {
      const updatedNodes = deleteBetween(nodes, nodeIdIndex, selection);
      const caret = { ...selection.start };
      return {
        ...state,
        nodes: updatedNodes,
        selection: {
          start: caret,
          end: caret,
          isCollapsed: true,
        },
      };
    }

    const nodeIndex = findNodeIndex(nodeIdIndex, selection.start.nodeId);
    if (nodeIndex === -1) return state;

    const node = nodes[nodeIndex]!;
    const newNode = deleteCharInNode(node, direction, selection.start.offset);
    const updatedNodes = replaceNodeAtIndex(nodes, nodeIndex, newNode);

    const newOffset = Math.max(
      selection.start.offset - (direction === "backward" ? 1 : 0),
      0,
    );
    const caret = {
      ...selection.start,
      offset: newOffset,
    };

    return {
      ...state,
      nodes: updatedNodes,
      selection: {
        start: caret,
        end: caret,
        isCollapsed: true,
      },
    };
  };
}

function deleteCharInNode(
  node: EditorNode,
  direction: "backward" | "forward",
  offset: number,
) {
  const deletePosition = direction === "backward" ? offset - 1 : offset;

  const newText =
    node.text.slice(0, deletePosition) + node.text.slice(deletePosition + 1);
  const newMarks = adjustMarks(node.marks, {
    offset: deletePosition,
    deletedLength: 1,
    insertedLength: 0,
  });

  return {
    ...node,
    text: newText,
    marks: newMarks,
  };
}
