import type { SelectionRange } from "../types";

export function getCaretPositionAfterInsertText(range: SelectionRange) {
  return {
    ...range.start,
    offset: range.start.offset + 1,
  };
}
