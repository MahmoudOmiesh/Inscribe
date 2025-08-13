import { cleanNode, createParagraph } from "../model/nodes";
import type { EditorNode } from "../model/schema";

export function normalizeNodes(nodes: EditorNode[]) {
  const normalizedNodes = nodes.map(cleanNode);
  if (normalizedNodes.length === 0) {
    return [createParagraph()];
  }

  return normalizedNodes;
}
