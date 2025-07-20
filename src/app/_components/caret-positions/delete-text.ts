import type { SelectionRange } from "../types";

export function getCaretPositionAfterDeleteText(range: SelectionRange) {
  return {
    ...range.start,
    offset: Math.max(
      range.isCollapsed ? range.start.offset - 1 : range.start.offset,
      0,
    ),
  };
}
