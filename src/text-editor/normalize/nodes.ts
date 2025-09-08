import { getPlaceholderText } from "../components/utils";
import { isListItem } from "../model/lists";
import { createParagraph } from "../model/nodes";
import type { EditorNode } from "../model/schema";

export function normalizeNodes(nodes: EditorNode[]) {
  let changed = false;
  let baseNodes = nodes;
  if (baseNodes.length === 0) {
    baseNodes = [createParagraph()];
    changed = true;
  }

  const normalizedNodes = baseNodes.map((node) => {
    const cleaned = cleanNodePreserveReference(node);
    if (cleaned !== node) {
      changed = true;
    }
    return cleaned;
  });

  // Placeholder handling:
  // - If there is exactly one node and it has no text, set a placeholder.
  // - Otherwise, remove any placeholder from all nodes.
  const shouldShowPlaceholder =
    normalizedNodes.length === 1 && normalizedNodes[0]!.text.length === 0;
  const placeholderText = getPlaceholderText(normalizedNodes[0]!.type);

  let placeholderChanged = false;

  if (shouldShowPlaceholder) {
    const first = normalizedNodes[0]!;
    if (first.placeholder !== placeholderText) {
      normalizedNodes[0] = {
        ...first,
        placeholder: placeholderText,
      };
      placeholderChanged = true;
    }
  } else {
    for (let i = 0; i < normalizedNodes.length; i++) {
      const node = normalizedNodes[i]!;
      if (node.placeholder !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { placeholder, ...rest } = node;
        normalizedNodes[i] = rest;
        placeholderChanged = true;
      }
    }
  }

  return changed || placeholderChanged ? normalizedNodes : nodes;
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
