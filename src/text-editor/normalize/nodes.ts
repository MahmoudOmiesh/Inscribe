import { isListItem } from "../model/lists";
import { createParagraph } from "../model/nodes";
import type { EditorNode } from "../model/schema";

export function normalizeNodes(nodes: EditorNode[]) {
  if (nodes.length === 0) {
    return [createParagraph()];
  }

  let changed = false;
  const normalizedNodes = nodes.map((node) => {
    const cleaned = cleanNodePreserveReference(node);
    if (cleaned !== node) {
      changed = true;
    }
    return cleaned;
  });

  return changed ? normalizedNodes : nodes;
}

function cleanNodePreserveReference(node: EditorNode) {
  const hasListProps =
    "listId" in node || "indentLevel" in node || "checked" in node;

  if (node.type === "separator") {
    node.text = "";
    node.marks = [];
    node.alignment = "left";
  }

  if (!isListItem(node) && hasListProps) {
    return {
      id: node.id,
      type: node.type,
      text: node.text,
      marks: node.marks,
      alignment: node.alignment,
    } as EditorNode;
  }

  return node;
}
