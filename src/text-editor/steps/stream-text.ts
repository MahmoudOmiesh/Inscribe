import type { Mark } from "../model/schema";
import type { EditorState } from "../state/editor-state";
import type { Step } from "../state/transaction";
import { findNodeIndex } from "./shared";

export function streamTextStep(
  nodeId: string,
  text: string,
  marks?: Mark[],
): Step {
  return (state: EditorState) => {
    const { nodes, nodeIdIndex } = state;

    const nodeIndex = findNodeIndex(nodeIdIndex, nodeId);
    if (nodeIndex === -1) return state;

    const node = nodes[nodeIndex]!;
    const updatedNodes = [...nodes];

    updatedNodes[nodeIndex] = {
      ...node,
      text: text,
      marks: marks ?? [],
    };

    const caret = {
      nodeId,
      offset: text.length,
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
