import type { SelectionRange } from "../model/selection";
import type { CaretPosition } from "../model/selection";

export function getSelectionRange(): SelectionRange | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);

  const start = domToCaretPosition(
    range.startContainer,
    range.startOffset,
    true,
  );
  const end = domToCaretPosition(range.endContainer, range.endOffset, false);

  if (!start || !end) return null;

  return {
    start,
    end,
    isCollapsed: isRangeCollapsed(start, end),
  };
}

function domToCaretPosition(node: Node, offset: number, isStart: boolean) {
  let element =
    node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as Element);

  if (element && element.tagName === "BR") {
    element = element.parentElement;
  }

  if (element && (element as HTMLElement).dataset?.textEditorRoot) {
    const root = element as HTMLElement;
    const nodes = root.querySelectorAll("[data-node-id]");
    if (nodes.length === 0) return null;

    const node = isStart ? nodes[0]! : nodes[nodes.length - 1]!;
    const nodeId = node.getAttribute("data-node-id")!;
    const offset = isStart ? 0 : elementTextLength(node);

    return {
      nodeId,
      offset,
    };
  }

  const editorNode = element?.closest("[data-node-id]");
  if (!editorNode) return null;

  const nodeId = editorNode.getAttribute("data-node-id")!;

  if (editorNode.contains(node)) {
    const range = document.createRange();
    range.setStart(editorNode, 0);
    range.setEnd(node, offset);

    const text = range.toString();

    return {
      nodeId,
      offset: text.length,
    };
  }

  return {
    nodeId,
    offset: isStart ? 0 : elementTextLength(editorNode),
  };
}

export function setSelectionRange(range: SelectionRange) {
  const anchorPoint = caretPositionToDom(range.start);
  const focusPoint = caretPositionToDom(range.end);

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

  const lastTextNode = getLastTextNode(nodeElement);
  if (lastTextNode) {
    return {
      node: lastTextNode,
      offset: lastTextNode.data.length,
    };
  }

  return {
    node: nodeElement,
    offset: 0,
  };
}

function getLastTextNode(el: Element) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  let last: Text | null = null;
  let text = walker.nextNode() as Text | null;
  while (text) {
    last = text;
    text = walker.nextNode() as Text | null;
  }
  return last;
}

function elementTextLength(el: Element) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  let text = walker.nextNode() as Text | null;
  let currentOffset = 0;
  while (text) {
    currentOffset += text.data.length;
    text = walker.nextNode() as Text | null;
  }
  return currentOffset;
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
