import type { EditorState } from "../state/editor-state";
import { Transaction } from "../state/transaction";
import { deleteCharStep } from "../steps/delete-char";
import { deleteWordStep } from "../steps/delete-word";
import { mergeStep } from "../steps/merge";
import { outdentStep } from "../steps/outdent";
import {
  findAdjacentNodes,
  shouldMergeBackward,
  shouldMergeForward,
  shouldOutdentOnBackspace,
} from "./rules";

export function deleteBackward(state: EditorState) {
  const { nodes, nodeIdIndex, selection } = state;

  if (shouldOutdentOnBackspace(nodes, nodeIdIndex, selection)) {
    return new Transaction(state).add(outdentStep());
  }

  if (shouldMergeBackward(selection)) {
    const nodeIds = findAdjacentNodes(
      nodes,
      nodeIdIndex,
      selection.start.nodeId,
      "backward",
    );
    if (!nodeIds) return null;

    const [firstNodeId, secondNodeId] = nodeIds;
    return new Transaction(state).add(mergeStep(firstNodeId, secondNodeId));
  }

  return new Transaction(state).add(deleteCharStep("backward"));
}

export function deleteForward(state: EditorState) {
  const { nodes, nodeIdIndex, selection } = state;

  if (shouldMergeForward(nodes, nodeIdIndex, selection)) {
    const nodeIds = findAdjacentNodes(
      nodes,
      nodeIdIndex,
      selection.start.nodeId,
      "forward",
    );
    if (!nodeIds) return null;

    const [firstNodeId, secondNodeId] = nodeIds;
    return new Transaction(state).add(mergeStep(firstNodeId, secondNodeId));
  }

  return new Transaction(state).add(deleteCharStep("forward"));
}

export function deleteWordBackward(state: EditorState) {
  const { nodes, nodeIdIndex, selection } = state;

  if (shouldOutdentOnBackspace(nodes, nodeIdIndex, selection)) {
    return new Transaction(state).add(outdentStep());
  }

  if (shouldMergeBackward(selection)) {
    const nodeIds = findAdjacentNodes(
      nodes,
      nodeIdIndex,
      selection.start.nodeId,
      "backward",
    );
    if (!nodeIds) return null;

    const [firstNodeId, secondNodeId] = nodeIds;
    return new Transaction(state).add(mergeStep(firstNodeId, secondNodeId));
  }

  return new Transaction(state).add(deleteWordStep("backward"));
}

export function deleteWordForward(state: EditorState) {
  const { nodes, nodeIdIndex, selection } = state;

  if (shouldMergeForward(nodes, nodeIdIndex, selection)) {
    const nodeIds = findAdjacentNodes(
      nodes,
      nodeIdIndex,
      selection.start.nodeId,
      "forward",
    );
    if (!nodeIds) return null;

    const [firstNodeId, secondNodeId] = nodeIds;
    return new Transaction(state).add(mergeStep(firstNodeId, secondNodeId));
  }

  return new Transaction(state).add(deleteWordStep("forward"));
}
