import type { EditorNode } from "../../utils/types";
import type { DeleteByCutOperation } from "../../utils/types";
import { deleteBetween } from "../shared/delete-between";

export function deleteByCut(
  nodes: EditorNode[],
  nodeIdIndexMap: Map<string, number>,
  operation: DeleteByCutOperation,
) {
  const { range } = operation;

  return {
    nodes: deleteBetween(nodes, nodeIdIndexMap, range),
    newCaretPosition: {
      ...range.start,
    },
  };
}
