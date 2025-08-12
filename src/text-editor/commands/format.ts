import type {
  ActiveMarkDescriptor,
  Alignment,
  BlockType,
} from "../model/schema";
import type { EditorState } from "../state/editor-state";
import { Transaction } from "../state/transaction";
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
