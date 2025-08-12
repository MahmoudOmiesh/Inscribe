import { cleanNode } from "../model/nodes";
import type { EditorNode } from "../model/schema";

export function normalizeNodes(nodes: EditorNode[]) {
  return nodes.map(cleanNode);
}
