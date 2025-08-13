import { getListBoundaries, isListItem } from "../model/lists";
import type { EditorState } from "../state/editor-state";
import type { Step } from "../state/transaction";
import { findNodeIndex } from "./shared";

export function deleteNodeStep(nodeId: string): Step {
  return (state: EditorState) => {
    const { nodes, nodeIdIndex } = state;

    const nodeIndex = findNodeIndex(nodeIdIndex, nodeId);
    if (nodeIndex === -1) return state;

    const node = nodes[nodeIndex]!;

    const isList = isListItem(node);
    const listBoundaries = isList ? getListBoundaries(nodes, nodeIndex) : null;

    const start = listBoundaries?.start ?? nodeIndex;
    const end = listBoundaries?.end ?? nodeIndex;

    const updatedNodes = [...nodes.slice(0, start), ...nodes.slice(end + 1)];

    const nextNode = nodes[end + 1] ?? null;
    const previousNode = nodes[start - 1] ?? null;

    const caret = nextNode
      ? {
          nodeId: nextNode.id,
          offset: 0,
        }
      : previousNode
        ? {
            nodeId: previousNode.id,
            offset: previousNode.text.length,
          }
        : null;

    return {
      ...state,
      nodes: updatedNodes,
      selection: caret
        ? {
            start: caret,
            end: caret,
            isCollapsed: true,
          }
        : state.selection,
    };
  };
}
