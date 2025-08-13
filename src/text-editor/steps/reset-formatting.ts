import { getListBoundaries, isListItem } from "../model/lists";
import type { EditorState } from "../state/editor-state";
import type { Step } from "../state/transaction";
import { findNodeIndex } from "./shared";

export function resetFormattingStep(nodeId: string): Step {
  return (state: EditorState) => {
    const { nodes, nodeIdIndex } = state;

    const nodeIndex = findNodeIndex(nodeIdIndex, nodeId);
    if (nodeIndex === -1) return state;

    const node = nodes[nodeIndex]!;
    const updatedNodes = [...nodes];

    const isList = isListItem(node);
    const listBoundaries = isList ? getListBoundaries(nodes, nodeIndex) : null;

    const start = listBoundaries?.start ?? nodeIndex;
    const end = listBoundaries?.end ?? nodeIndex;

    for (let i = start; i <= end; i++) {
      const node = nodes[i]!;
      updatedNodes[i] = { ...node, marks: [] };
    }

    return {
      ...state,
      nodes: updatedNodes,
    };
  };
}
