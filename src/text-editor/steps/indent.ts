import { getListBoundaries, isListItem } from "../model/lists";
import type { EditorState } from "../state/editor-state";
import type { Step } from "../state/transaction";
import { findNodeIndex } from "./shared";

export function indentStep(): Step {
  return (state: EditorState) => {
    const { nodes, nodeIdIndex, selection } = state;

    const startNodeIndex = findNodeIndex(nodeIdIndex, selection.start.nodeId);
    const endNodeIndex = findNodeIndex(nodeIdIndex, selection.end.nodeId);

    if (startNodeIndex === -1 || endNodeIndex === -1) return state;

    if (!isListItem(nodes[startNodeIndex]!)) return state;

    const listBoundaries = getListBoundaries(nodes, startNodeIndex);
    if (!listBoundaries || endNodeIndex > listBoundaries.end) return state;

    const listId = nodes[startNodeIndex].listId;
    const updatedNodes = [...nodes];

    for (let i = startNodeIndex; i <= endNodeIndex; i++) {
      const node = updatedNodes[i]!;
      if (!isListItem(node) || node.listId !== listId) continue;

      // clamping and handling maximum indent level is handled in the normalizer
      // no need to do it here
      updatedNodes[i] = { ...node, indentLevel: node.indentLevel + 1 };
    }

    return {
      ...state,
      nodes: updatedNodes,
    };
  };
}
