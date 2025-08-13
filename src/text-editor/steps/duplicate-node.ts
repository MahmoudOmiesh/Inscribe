import { nanoid } from "nanoid";
import { getListBoundaries, isListItem } from "../model/lists";
import type { EditorState } from "../state/editor-state";
import type { Step } from "../state/transaction";
import { findNodeIndex } from "./shared";

export function duplicateNodeStep(nodeId: string): Step {
  return (state: EditorState) => {
    const { nodes, nodeIdIndex } = state;

    const nodeIndex = findNodeIndex(nodeIdIndex, nodeId);
    if (nodeIndex === -1) return state;

    const node = nodes[nodeIndex]!;

    const isList = isListItem(node);
    const newListId = isList ? nanoid() : null;
    const listBoundaries = isList ? getListBoundaries(nodes, nodeIndex) : null;

    const start = listBoundaries?.start ?? nodeIndex;
    const end = listBoundaries?.end ?? nodeIndex;

    const duplicatedNodes = [];
    for (let i = start; i <= end; i++) {
      const node = nodes[i]!;
      const base = {
        ...node,
        id: nanoid(),
      };

      if (isList) {
        duplicatedNodes.push({
          ...base,
          listId: newListId!,
        });
      } else {
        duplicatedNodes.push(base);
      }
    }

    const updatedNodes = [
      ...nodes.slice(0, end + 1),
      ...duplicatedNodes,
      ...nodes.slice(end + 1),
    ];

    const caret = {
      nodeId: duplicatedNodes[duplicatedNodes.length - 1]!.id,
      offset: duplicatedNodes[duplicatedNodes.length - 1]!.text.length,
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
