import { adjustMarks, createInsertChange } from "../../utils/adjust-marks";
import type { EditorNode, InsertTextOperation, Mark } from "../../utils/types";
import { deleteBetween } from "../shared/delete-between";
import { mergeOverlappingMarks } from "../shared/merge-marks";
import {
  findNodeIndexById,
  replaceNodeAtIndex,
} from "../shared/node-operations";

export function insertText(
  nodes: EditorNode[],
  activeMarks: Mark["type"][],
  operation: InsertTextOperation,
) {
  const { range, text } = operation;
  const newNodes = range.isCollapsed ? nodes : deleteBetween(nodes, range);

  const nodeIndex = findNodeIndexById(newNodes, range.start.nodeId);
  if (nodeIndex === -1) return { nodes, newCaretPosition: null };

  const node = newNodes[nodeIndex]!;
  const newNode = insertTextIntoNode(
    node,
    activeMarks,
    range.start.offset,
    text,
  );

  return {
    nodes: replaceNodeAtIndex(newNodes, nodeIndex, newNode),
    newCaretPosition: {
      ...range.start,
      offset: range.start.offset + text.length,
    },
  };
}

function insertTextIntoNode(
  node: EditorNode,
  activeMarks: Mark["type"][],
  offset: number,
  text: string,
) {
  const newText = node.text.slice(0, offset) + text + node.text.slice(offset);

  const change = createInsertChange(offset, text.length);
  const newMarks = adjustMarks(node.marks, change);
  const newMarksFromActive = activeMarks.map((mark) => ({
    type: mark,
    start: offset,
    end: offset + text.length,
  }));

  return {
    ...node,
    text: newText,
    marks: mergeOverlappingMarks([...newMarks, ...newMarksFromActive]),
  };
}
