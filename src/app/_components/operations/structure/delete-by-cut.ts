import type { EditorNode } from "../../utils/types";
import type { DeleteByCutOperation } from "../../utils/types";
import { deleteBetween } from "../shared/delete-between";

export function deleteByCut(
  nodes: EditorNode[],
  operation: DeleteByCutOperation,
) {
  const { range } = operation;

  return {
    nodes: deleteBetween(nodes, range),
    newCaretPosition: {
      ...range.start,
    },
  };
}
