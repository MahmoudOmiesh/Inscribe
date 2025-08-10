import { buildNodeIdxMap } from "../model/nodes";
import type { ActiveMarkDescriptor, EditorNode } from "../model/schema";
import type { SelectionRange } from "../model/selection";

export interface EditorState {
  nodes: EditorNode[];
  selection: SelectionRange;
  typingMarks: ActiveMarkDescriptor[]; // marks that we want to keep at next typing
  nodeIdIndex: Map<string, number>;
}

export function createInitialEditorState(
  nodes: EditorNode[],
  selection: SelectionRange,
) {
  return {
    nodes,
    selection,
    typingMarks: [],
    nodeIdIndex: buildNodeIdxMap(nodes),
  };
}
