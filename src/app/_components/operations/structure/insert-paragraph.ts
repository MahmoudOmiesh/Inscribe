import type {
  EditorNode,
  InsertParagraphOperation,
  ListItemNode,
} from "../../utils/types";
import { toggleNodeType } from "../formatting/toggle-node-type";
import { deleteBetween } from "../shared/delete-between";
import {
  findNodeIndexById,
  isListItem,
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

  // // Pressing enter on an empty list item should convert it to a paragraph
  // if (
  //   range.isCollapsed &&
  //   range.start.offset === 0 &&
  //   isListItem(node) &&
  //   node.text.length === 0
  // ) {
  //   return toggleNodeType(newNodes, nodeIdIndexMap, {
  //     type: "toggleNodeType",
  //     nodeType: "paragraph",
  //     range,
  //   });
  // }

  const [left, right] = splitNode({
    node,
    offset: range.start.offset,
    newNodeId,
  });

  if (right.text.length === 0 && !isListItem(left)) {
    // If the right node is empty
    // we set it to a paragraph
    // if the left node wasn't a list item
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
