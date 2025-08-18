import { buildNodeIdxMap } from "../model/nodes";
import type { EditorState } from "../state/editor-state";
import { normalizeLists } from "./lists";
import { normalizeMarks } from "./marks";
import { normalizeNodes } from "./nodes";

export function normalizePipeline(editorState: EditorState): EditorState {
  editorState.nodes = normalizeNodes(editorState.nodes);
  editorState.nodes = normalizeMarks(editorState.nodes);
  editorState.nodes = normalizeLists(editorState.nodes);

  editorState.nodeIdIndex = buildNodeIdxMap(editorState.nodes);

  return editorState;
}
