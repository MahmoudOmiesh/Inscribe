import type { EditorState } from "../state/editor-state";
import type { Step } from "../state/transaction";
import { findNodeIndex, mergeTwoNodes, replaceNodesInRange } from "./shared";

export function mergeStep(firstNodeId: string, secondNodeId: string): Step {
  return (state: EditorState) => {
    const { nodes, nodeIdIndex } = state;
    const firstNodeIndex = findNodeIndex(nodeIdIndex, firstNodeId);
    const secondNodeIndex = findNodeIndex(nodeIdIndex, secondNodeId);

    if (firstNodeIndex === -1 || secondNodeIndex === -1) return state;

    const firstNode = nodes[firstNodeIndex]!;
    const secondNode = nodes[secondNodeIndex]!;

    const newNode = mergeTwoNodes(firstNode, secondNode);

    const updatedNodes = replaceNodesInRange(
      nodes,
      firstNodeIndex,
      secondNodeIndex,
      newNode,
    );

    const caret = {
      nodeId: firstNodeId,
      offset: firstNode.text.length,
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
