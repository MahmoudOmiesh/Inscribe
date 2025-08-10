import { buildNodeIdxMap } from "../model/nodes";
import type { EditorState } from "../state/editor-state";
import { normalizeLists } from "./lists";
import { normalizeMarks } from "./marks";
import { normalizeNodes } from "./nodes";

export function normalizePipeline(editorState: EditorState): EditorState {
  let nodes = editorState.nodes;

  nodes = normalizeNodes(nodes);
  nodes = normalizeMarks(nodes);
  nodes = normalizeLists(nodes);

  return {
    ...editorState,
    nodes,
    nodeIdIndex: buildNodeIdxMap(nodes),
  };
}
