import { nanoid } from "nanoid";
import type { TextBlockType } from "../model/schema";
import type { EditorState } from "../state/editor-state";
import type { Step } from "../state/transaction";
import { findNodeIndex } from "./shared";
import { getListBoundaries } from "../model/lists";
import { createListItem } from "../model/nodes";

export function toggleBlockTypeStep(
  blockType: TextBlockType,
  // we should always treat lists as a single node,
  // except if it is the last item in the list, we can do both
  { treatListAsSingleNode = true }: { treatListAsSingleNode?: boolean } = {},
): Step {
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
      const listBoundaries = treatListAsSingleNode
        ? getListBoundaries(updatedNodes, i)
        : null;

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
