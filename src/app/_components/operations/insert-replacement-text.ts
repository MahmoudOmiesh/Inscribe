import type {
  EditorNode,
  InsertReplacementTextOperation,
} from "../utils/types";

export function insertReplacementText(
  nodes: EditorNode[],
  operation: InsertReplacementTextOperation,
) {
  const { range, text } = operation;

  const nodeIndex = nodes.findIndex((n) => n.id === range.start.nodeId);
  if (nodeIndex === -1) return { nodes, newCaretPosition: null };

  const node = nodes[nodeIndex]!;
  const newText =
    node.text.slice(0, range.start.offset) +
    text +
    node.text.slice(range.end.offset);

  return {
    nodes: [
      ...nodes.slice(0, nodeIndex),
      { ...node, text: newText },
      ...nodes.slice(nodeIndex + 1),
    ],
    newCaretPosition: null,
  };
}
