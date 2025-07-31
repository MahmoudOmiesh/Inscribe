import type { EditorNode, InsertParagraphOperation } from "../../utils/types";
import { deleteBetween } from "../shared/delete-between";
import {
  findNodeIndexById,
  replaceNodeAtIndex,
} from "../shared/node-operations";
import { splitNode } from "../shared/split-node";

export function insertParagraph(
  nodes: EditorNode[],
  nodeIdIndexMap: Map<string, number>,
  operation: InsertParagraphOperation,
) {
  const { range, newNodeId } = operation;

  const newNodes = range.isCollapsed
    ? nodes
    : deleteBetween(nodes, nodeIdIndexMap, range);
  const nodeIndex = findNodeIndexById(nodeIdIndexMap, range.start.nodeId);
  if (nodeIndex === -1) return { nodes, newCaretPosition: null };

  const node = newNodes[nodeIndex]!;
  const [left, right] = splitNode({
    node,
    offset: range.start.offset,
    newNodeId,
  });

  if (right.text.length === 0) {
    right.type = "paragraph";
    right.alignment = "left";
    right.marks = [];
  }

  return {
    nodes: replaceNodeAtIndex(newNodes, nodeIndex, [left, right]),
    newCaretPosition: {
      nodeId: newNodeId,
      offset: 0,
    },
  };
}
