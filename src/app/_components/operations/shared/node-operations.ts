import type { EditorNode } from "../../utils/types";

export function findNodeIndexById(
  nodeIdIndexMap: Map<string, number>,
  id: string,
) {
  return nodeIdIndexMap.get(id) ?? -1;
}

export function findNodeById(
  nodes: EditorNode[],
  nodeIdIndexMap: Map<string, number>,
  id: string,
) {
  const index = findNodeIndexById(nodeIdIndexMap, id);
  if (index === -1) return null;
  return nodes[index]!;
}

export function replaceNodeAtIndex(
  nodes: EditorNode[],
  index: number,
  newNodes: EditorNode | EditorNode[],
) {
  return [
    ...nodes.slice(0, index),
    ...(Array.isArray(newNodes) ? newNodes : [newNodes]),
    ...nodes.slice(index + 1),
  ];
}

export function replaceNodesInRange(
  nodes: EditorNode[],
  startIndex: number,
  endIndex: number,
  newNodes: EditorNode | EditorNode[],
) {
  return [
    ...nodes.slice(0, startIndex),
    ...(Array.isArray(newNodes) ? newNodes : [newNodes]),
    ...nodes.slice(endIndex + 1),
  ];
}

export function updateNodesInRange(
  nodes: EditorNode[],
  startIndex: number,
  endIndex: number,
  updates: Partial<EditorNode>,
) {
  const newNodes = [...nodes];
  for (let i = startIndex; i <= endIndex; i++) {
    newNodes[i] = { ...newNodes[i]!, ...updates };
  }
  return newNodes;
}
