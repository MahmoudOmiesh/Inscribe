import type { ActiveMarkDescriptor, EditorNode } from "../model/schema";
import type { SelectionRange } from "../model/selection";
import { normalizePipeline } from "../normalize/pipeline";

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
  const initialState = {
    nodes,
    selection,
    typingMarks: [],
    nodeIdIndex: new Map(),
  };

  return normalizePipeline(initialState);
}
