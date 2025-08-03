import { isListItem } from "../operations/shared/node-operations";
import type { EditorNode } from "./types";

/**
 * Normalises a node so it only carries the properties that
 * are valid for its current `type`.
 *
 * – Removes `listId/indentLevel` from non-list nodes
 * – Guarantees `listId` & `indentLevel` for list items
 * – Fills default values for `alignment` & `marks`
 */
export function cleanNode(node: EditorNode): EditorNode {
  const base = {
    id: node.id,
    text: node.text,
    alignment: node.alignment ?? "left",
    marks: node.marks ?? [],
  };

  if (isListItem(node)) {
    return {
      ...base,
      type: node.type,
      listId: node.listId,
      indentLevel: node.indentLevel,
    };
  }

  // Non-list blocks: strip list-specific props
  return {
    ...base,
    type: node.type,
  };
}
