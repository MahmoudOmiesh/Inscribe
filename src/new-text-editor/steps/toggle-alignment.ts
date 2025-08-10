import type { Alignment } from "../model/schema";
import type { EditorState } from "../state/editor-state";
import type { Step } from "../state/transaction";
import { findNodeIndex } from "./shared";

export function toggleAlignmentStep(alignment: Alignment): Step {
  return (state: EditorState) => {
    const { nodes, nodeIdIndex, selection } = state;

    const startNodeIndex = findNodeIndex(nodeIdIndex, selection.start.nodeId);
    const endNodeIndex = findNodeIndex(nodeIdIndex, selection.end.nodeId);

    if (startNodeIndex === -1 || endNodeIndex === -1) return state;

    const updatedNodes = [...nodes];

    for (let i = startNodeIndex; i <= endNodeIndex; i++) {
      const node = updatedNodes[i]!;

      updatedNodes[i] = { ...node, alignment };
    }

    return {
      ...state,
      nodes: updatedNodes,
    };
  };
}
