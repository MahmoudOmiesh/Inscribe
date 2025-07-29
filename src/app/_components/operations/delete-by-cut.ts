import type { EditorNode, Mark } from "../utils/types";
import type { DeleteByCutOperation } from "../utils/types";
import { deleteBetween } from "./helpers/delete-between";

export function deleteByCut(
  nodes: EditorNode[],
  activeMarks: Mark["type"][],
  operation: DeleteByCutOperation,
) {
  const { range } = operation;
  const newNodes = deleteBetween(nodes, range);

  return {
    nodes: newNodes,
    newCaretPosition: {
      ...range.start,
    },
  };
}
