import type {
  ActiveMarkDescriptor,
  Alignment,
  BlockType,
} from "../model/schema";
import type { EditorState } from "../state/editor-state";
import { Transaction } from "../state/transaction";
import { changeNodeTypeStep } from "../steps/change-node-type";
import { duplicateNodeStep } from "../steps/duplicate-node";
import { insertNodeAfterStep } from "../steps/insert-node-after";
import { resetFormattingStep } from "../steps/reset-formatting";
import { toggleAlignmentStep } from "../steps/toggle-alignment";
import { toggleBlockTypeStep } from "../steps/toggle-block-type";
import { toggleMarkStep } from "../steps/toggle-mark";

export function toggleMark(state: EditorState, mark: ActiveMarkDescriptor) {
  return new Transaction(state).add(toggleMarkStep(mark));
}

export function toggleBlockType(state: EditorState, blockType: BlockType) {
  return new Transaction(state).add(toggleBlockTypeStep(blockType));
}

export function toggleAlignment(state: EditorState, alignment: Alignment) {
  return new Transaction(state).add(toggleAlignmentStep(alignment));
}

export function resetFormatting(state: EditorState, nodeId: string) {
  return new Transaction(state).add(resetFormattingStep(nodeId));
}

export function duplicateNode(state: EditorState, nodeId: string) {
  return new Transaction(state).add(duplicateNodeStep(nodeId));
}

export function insertNodeAfter(state: EditorState, nodeId: string) {
  return new Transaction(state).add(insertNodeAfterStep(nodeId));
}

export function changeNodeType(
  state: EditorState,
  nodeId: string,
  blockType: BlockType,
) {
  return new Transaction(state).add(changeNodeTypeStep(nodeId, blockType));
}
