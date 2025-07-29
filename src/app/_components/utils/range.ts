import type {
  CaretPosition,
  PendingCaretPosition,
  SelectionRange,
} from "./types";

export function getSelectionRange(): SelectionRange | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const anchor = selection.anchorNode
    ? domToCaretPosition(selection.anchorNode, selection.anchorOffset)
    : null;
  const focus = selection.focusNode
    ? domToCaretPosition(selection.focusNode, selection.focusOffset)
    : null;

  if (!anchor || !focus) return null;
  const isCollapsed = isRangeCollapsed(anchor, focus);

  if (selection.direction === "backward") {
    return {
      start: focus,
      end: anchor,
      isCollapsed,
    };
  }

  return {
    start: anchor,
    end: focus,
    isCollapsed,
  };
}

function domToCaretPosition(node: Node, offset: number) {
  const element =
    node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as Element);
  const editorNode = element?.closest("[data-node-id]");

  if (!editorNode) return null;

  const nodeId = editorNode.getAttribute("data-node-id")!;
  const walker = document.createTreeWalker(
    editorNode,
    NodeFilter.SHOW_TEXT,
    null,
  );

  let currentOffset = 0;
  let textNode = walker.nextNode() as Text | null;

  while (textNode) {
    if (textNode === node) {
      return {
        nodeId,
        offset: currentOffset + offset,
      };
    }

    currentOffset += textNode.data.length;
    textNode = walker.nextNode() as Text | null;
  }

  return {
    nodeId,
    offset: 0,
  };
}

export function setSelectionRange(range: PendingCaretPosition) {
  const anchorPoint =
    "start" in range
      ? caretPositionToDom(range.start)
      : caretPositionToDom(range);
  const focusPoint =
    "end" in range ? caretPositionToDom(range.end) : anchorPoint;

  if (!anchorPoint || !focusPoint) return;

  const domRange = document.createRange();
  domRange.setStart(anchorPoint.node, anchorPoint.offset);
  domRange.setEnd(focusPoint.node, focusPoint.offset);

  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(domRange);
}

function caretPositionToDom(position: CaretPosition) {
  const nodeElement = document.querySelector(
    `[data-node-id="${position.nodeId}"]`,
  );
  if (!nodeElement) return null;

  const walker = document.createTreeWalker(
    nodeElement,
    NodeFilter.SHOW_TEXT,
    null,
  );

  let text = walker.nextNode() as Text | null;
  let currentOffset = 0;
  while (text) {
    if (currentOffset + text.data.length >= position.offset) {
      return {
        node: text,
        offset: position.offset - currentOffset,
      };
    }
    currentOffset += text.data.length;
    text = walker.nextNode() as Text | null;
  }

  return {
    node: nodeElement,
    offset: 0,
  };
}

function isRangeCollapsed(start: CaretPosition, end: CaretPosition) {
  return start.nodeId === end.nodeId && start.offset === end.offset;
}

export function compareSelectionRanges(
  range1: SelectionRange | null,
  range2: SelectionRange | null,
) {
  if (!range1 || !range2) return false;
  return (
    range1.start.nodeId === range2.start.nodeId &&
    range1.start.offset === range2.start.offset &&
    range1.end.nodeId === range2.end.nodeId &&
    range1.end.offset === range2.end.offset
  );
}
