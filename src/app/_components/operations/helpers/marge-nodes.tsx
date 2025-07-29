import { adjustMarks, createInsertChange } from "../../utils/adjust-marks";
import type { EditorNode } from "../../utils/types";

export function mergeNodes(firstNode: EditorNode, secondNode: EditorNode) {
  const secondNodeChange = createInsertChange(0, firstNode.text.length);
  const secondNodeMarks = adjustMarks(secondNode.marks, secondNodeChange);
  const newNode = {
    ...firstNode,
    text: firstNode.text + secondNode.text,
    marks: [...firstNode.marks, ...secondNodeMarks],
  };

  return newNode;
}
