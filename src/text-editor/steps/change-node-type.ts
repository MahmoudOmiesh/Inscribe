import { nanoid } from "nanoid";
import { getListBoundaries } from "../model/lists";
import { createListItem } from "../model/nodes";
import type { TextBlockType } from "../model/schema";
import type { EditorState } from "../state/editor-state";
import type { Step } from "../state/transaction";
import { findNodeIndex } from "./shared";

export function changeNodeTypeStep(
  nodeId: string,
  blockType: TextBlockType,
): Step {
  return (state: EditorState) => {
    const { nodes, nodeIdIndex } = state;

    const nodeIndex = findNodeIndex(nodeIdIndex, nodeId);
    if (nodeIndex === -1) return state;

    const isList =
      blockType === "unordered-list-item" ||
      blockType === "ordered-list-item" ||
      blockType === "check-list-item";
    const listId = isList ? nanoid() : null;

    const listBoundaries = getListBoundaries(nodes, nodeIndex);
    const start = listBoundaries?.start ?? nodeIndex;
    const end = listBoundaries?.end ?? nodeIndex;

    const updatedNodes = [...nodes];
    for (let i = start; i <= end; i++) {
      const node = updatedNodes[i]!;

      if (isList) {
        const listItem = createListItem({
          ...node,
          type: blockType,
          listId: listId!,
          indentLevel: 0,
        });
        updatedNodes[i] = listItem;
      } else {
        updatedNodes[i] = { ...node, type: blockType };
      }
    }

    const caret = {
      nodeId: updatedNodes[end]!.id,
      offset: updatedNodes[end]!.text.length,
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
