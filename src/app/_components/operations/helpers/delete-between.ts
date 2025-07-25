import {
  adjustMarks,
  createDeleteChange,
  createReplaceChange,
} from "../../utils/marks";
import type { EditorNode, Mark, SelectionRange } from "../../utils/types";

export function deleteBetween(
  nodes: EditorNode[],
  activeMarks: Mark["type"][],
  range: SelectionRange,
) {
  const startNodeIndex = nodes.findIndex((n) => n.id === range.start.nodeId);
  const endNodeIndex = nodes.findIndex((n) => n.id === range.end.nodeId);

  if (startNodeIndex === -1 || endNodeIndex === -1) return nodes;

  if (startNodeIndex === endNodeIndex) {
    // Delete within same node
    const node = nodes[startNodeIndex]!;
    const deletedLength = range.end.offset - range.start.offset;

    const newText =
      node.text.slice(0, range.start.offset) +
      node.text.slice(range.end.offset);

    const change = createDeleteChange(range.start.offset, deletedLength);
    const newMarks = adjustMarks(node.marks, change);

    return [
      ...nodes.slice(0, startNodeIndex),
      { ...node, text: newText, marks: newMarks },
      ...nodes.slice(startNodeIndex + 1),
    ];
  }

  // Delete across multiple nodes
  const startNode = nodes[startNodeIndex]!;
  const endNode = nodes[endNodeIndex]!;

  const startText = startNode.text.slice(0, range.start.offset);
  const endText = endNode.text.slice(range.end.offset);
  const mergedText = startText + endText;

  const startChange = createDeleteChange(
    range.start.offset,
    startNode.text.length - range.start.offset,
  );
  const startMarks = adjustMarks(startNode.marks, startChange);

  const endChange = createReplaceChange(0, range.end.offset, startText.length);
  const endMarks = adjustMarks(endNode.marks, endChange);

  const mergedNode = {
    ...startNode,
    text: mergedText,
    marks: [...startMarks, ...endMarks],
  };

  return [
    ...nodes.slice(0, startNodeIndex),
    mergedNode,
    ...nodes.slice(endNodeIndex + 1),
  ];
}
