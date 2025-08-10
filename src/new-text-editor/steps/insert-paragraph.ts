import { nanoid } from "nanoid";
import type { EditorState } from "../state/editor-state";
import {
  deleteBetween,
  findNodeIndex,
  replaceNodeAtIndex,
  splitNode,
} from "./shared";
import { isListItem } from "../model/lists";
import type { Step } from "../state/transaction";

export function insertParagraphStep(): Step {
  return (state: EditorState) => {
    const { nodes, nodeIdIndex, selection } = state;
    const base = selection.isCollapsed
      ? nodes
      : deleteBetween(nodes, nodeIdIndex, selection);

    const nodeIndex = findNodeIndex(nodeIdIndex, selection.start.nodeId);
    if (nodeIndex === -1) return state;

    const node = base[nodeIndex]!;
    const rightNodeId = nanoid();

    const [left, right] = splitNode({
      node,
      offset: selection.start.offset,
      newNodeId: rightNodeId,
    });

    if (right.text.length === 0 && !isListItem(left)) {
      // If the right node is empty
      // we set it to a paragraph
      // if the left node wasn't a list item
      right.type = "paragraph";
      right.alignment = "left";
      right.marks = [];
    }

    const updatedNodes = replaceNodeAtIndex(base, nodeIndex, [left, right]);
    const caret = {
      nodeId: rightNodeId,
      offset: 0,
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
