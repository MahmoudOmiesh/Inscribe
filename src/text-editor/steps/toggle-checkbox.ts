import type { EditorState } from "../state/editor-state";
import type { Step } from "../state/transaction";
import { findNodeIndex } from "./shared";

export function toggleCheckboxStep(nodeId: string): Step {
  return (state: EditorState) => {
    const { nodes, nodeIdIndex } = state;

    const nodeIndex = findNodeIndex(nodeIdIndex, nodeId);
    if (nodeIndex === -1) return state;

    const node = nodes[nodeIndex]!;
    if (node.type !== "check-list-item") return state;

    const updatedNodes = [...nodes];
    updatedNodes[nodeIndex] = { ...node, checked: !node.checked };

    const caret = {
      nodeId,
      offset: 0,
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
