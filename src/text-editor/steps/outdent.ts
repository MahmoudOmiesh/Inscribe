import { getListBoundaries, isListItem } from "../model/lists";
import type { EditorState } from "../state/editor-state";
import type { Step } from "../state/transaction";
import { findNodeIndex } from "./shared";

export function outdentStep(): Step {
  return (state: EditorState) => {
    const { nodes, nodeIdIndex, selection } = state;

    const startNodeIndex = findNodeIndex(nodeIdIndex, selection.start.nodeId);
    const endNodeIndex = findNodeIndex(nodeIdIndex, selection.end.nodeId);

    if (startNodeIndex === -1 || endNodeIndex === -1) return state;

    if (!isListItem(nodes[startNodeIndex]!)) return state;

    const listBoundaries = getListBoundaries(nodes, startNodeIndex);
    if (!listBoundaries || endNodeIndex > listBoundaries.end) return state;

    const listId = nodes[startNodeIndex].listId;
    const indentLevel = nodes[startNodeIndex].indentLevel;
    if (indentLevel === 0) return state;

    const updatedNodes = [...nodes];
    for (let i = startNodeIndex; i <= listBoundaries.end; i++) {
      const node = nodes[i]!;
      if (
        !isListItem(node) ||
        node.listId !== listId ||
        node.indentLevel < indentLevel
      )
        break;

      updatedNodes[i] = { ...node, indentLevel: node.indentLevel - 1 };
    }

    return {
      ...state,
      nodes: updatedNodes,
    };
  };
}
