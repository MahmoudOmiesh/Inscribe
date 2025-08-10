import { nanoid } from "nanoid";
import type { BlockType } from "../model/schema";
import type { EditorState } from "../state/editor-state";
import type { Step } from "../state/transaction";
import { findNodeIndex } from "./shared";
import { getListBoundaries } from "../model/lists";
import { createListItem } from "../model/nodes";

export function toggleBlockTypeStep(blockType: BlockType): Step {
  return (state: EditorState) => {
    const { nodes, nodeIdIndex, selection } = state;

    const startNodeIndex = findNodeIndex(nodeIdIndex, selection.start.nodeId);
    const endNodeIndex = findNodeIndex(nodeIdIndex, selection.end.nodeId);

    if (startNodeIndex === -1 || endNodeIndex === -1) return state;

    const updatedNodes = [...nodes];
    const isList =
      blockType === "unordered-list-item" ||
      blockType === "ordered-list-item" ||
      blockType === "check-list-item";
    const listId = isList ? nanoid() : undefined;

    for (let i = startNodeIndex; i <= endNodeIndex; i++) {
      const listBoundaries = getListBoundaries(updatedNodes, i);

      const start = listBoundaries?.start ?? i;
      const end = listBoundaries?.end ?? i;

      for (let j = start; j <= end; j++) {
        const node = updatedNodes[j]!;

        if (isList) {
          const listItem = createListItem({
            ...node,
            type: blockType,
            listId: listId!,
            indentLevel: 0,
          });
          updatedNodes[j] = listItem;
        } else {
          updatedNodes[j] = { ...node, type: blockType };
        }
      }

      i = end;
    }

    return {
      ...state,
      nodes: updatedNodes,
    };
  };
}
