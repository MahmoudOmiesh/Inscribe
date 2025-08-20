import { getListBoundaries } from "../model/lists";
import { createParagraph, createSeparator } from "../model/nodes";
import type { EditorState } from "../state/editor-state";
import type { Step } from "../state/transaction";
import { findNodeIndex } from "./shared";

export function insertNodeAfterStep(
  nodeId: string,
  type: "paragraph" | "separator" = "paragraph",
): Step {
  return (state: EditorState) => {
    const { nodes, nodeIdIndex } = state;

    const nodeIndex = findNodeIndex(nodeIdIndex, nodeId);
    if (nodeIndex === -1) return state;

    const end = getListBoundaries(nodes, nodeIndex)?.end ?? nodeIndex;

    const updatedNodes = [
      ...nodes.slice(0, end + 1),
      type === "paragraph" ? createParagraph() : createSeparator(),
      ...nodes.slice(end + 1),
    ];

    const caret = {
      nodeId: updatedNodes[end + 1]!.id,
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
