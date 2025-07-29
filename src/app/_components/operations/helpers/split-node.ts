import { adjustMarks, createDeleteChange } from "../../utils/adjust-marks";
import type { EditorNode } from "../../utils/types";

export function splitNode({
  node,
  offset,
  newNodeId,
}: {
  node: EditorNode;
  offset: number;
  newNodeId: string;
}) {
  const leftChange = createDeleteChange(offset, node.text.length - offset);
  const leftMarks = adjustMarks(node.marks, leftChange);
  const left: EditorNode = {
    ...node,
    text: node.text.slice(0, offset),
    marks: leftMarks,
  };

  const rightChange = createDeleteChange(0, offset);
  const rightMarks = adjustMarks(node.marks, rightChange);
  const right: EditorNode = {
    ...node,
    id: newNodeId,
    text: node.text.slice(offset),
    marks: rightMarks,
  };

  return [left, right] as const;
}
