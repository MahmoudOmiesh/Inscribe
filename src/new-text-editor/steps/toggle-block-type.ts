import { nanoid } from "nanoid";
import type { BlockType } from "../model/schema";
import type { EditorState } from "../state/editor-state";
import type { Step } from "../state/transaction";
import { findNodeIndex } from "./shared";

export function toggleBlockTypeStep(blockType: BlockType): Step {
  return (state: EditorState) => {
    const { nodes, nodeIdIndex, selection } = state;

    const startNodeIndex = findNodeIndex(nodeIdIndex, selection.start.nodeId);
    const endNodeIndex = findNodeIndex(nodeIdIndex, selection.end.nodeId);

    if (startNodeIndex === -1 || endNodeIndex === -1) return state;

    const updatedNodes = [...nodes];
    const isList =
      blockType === "unordered-list-item" || blockType === "ordered-list-item";
    const listId = isList ? nanoid() : undefined;

    for (let i = startNodeIndex; i <= endNodeIndex; i++) {
      const node = updatedNodes[i]!;

      if (isList) {
        updatedNodes[i] = {
          ...node,
          type: blockType,
          listId: listId!,
          indentLevel: 0,
        };
      } else {
        updatedNodes[i] = { ...node, type: blockType };
      }
    }

    return {
      ...state,
      nodes: updatedNodes,
    };
  };
}
