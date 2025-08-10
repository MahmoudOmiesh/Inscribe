import {
  clampIndentsInGroup,
  getListBoundaries,
  isListItem,
} from "../model/lists";
import type { EditorNode } from "../model/schema";

export function normalizeLists(nodes: EditorNode[]) {
  const result: EditorNode[] = [...nodes];

  let i = 0;
  while (i < nodes.length) {
    const node = nodes[i]!;
    if (!isListItem(node)) {
      i++;
      continue;
    }

    const { start, end } = getListBoundaries(nodes, i)!;
    clampIndentsInGroup(result, start, end);
    i = end + 1;
  }

  return result;
}
