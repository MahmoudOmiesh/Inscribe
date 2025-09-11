import type { SelectionRange } from "../model/selection";

export function scrollCaretIntoView(range: SelectionRange) {
  if (!range.isCollapsed) return;

  const elem = document.querySelector(`[data-node-id="${range.start.nodeId}"]`);
  if (!elem) return;

  elem.scrollIntoView({
    behavior: "instant",
    block: "nearest",
  });
}
