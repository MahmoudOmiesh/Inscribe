import type { CaretPosition, EditorNode } from "./types";

export function getCaretPosition(nodes: EditorNode[]) {
  const selection = window.getSelection();
  if (!selection?.rangeCount) return null;

  const range = selection.getRangeAt(0);
  const { startContainer, startOffset } = range;

  // Find the closest node with data-node-id
  let element =
    startContainer.nodeType === Node.TEXT_NODE
      ? startContainer.parentElement
      : (startContainer as Element);

  while (element && !element.hasAttribute("data-node-id")) {
    element = element.parentElement;
  }

  if (!element) return null;

  const nodeId = element.getAttribute("data-node-id")!;

  // Find which child TextNode we're in and the offset within it
  const position = findPositionInDataModel({
    nodes,
    nodeElement: element,
    targetContainer: startContainer,
    targetOffset: startOffset,
    nodeId,
  });

  return position;
}

function findPositionInDataModel({
  nodes,
  nodeElement,
  targetContainer,
  targetOffset,
  nodeId,
}: {
  nodes: EditorNode[];
  nodeElement: Element;
  targetContainer: Node;
  targetOffset: number;
  nodeId: string;
}) {
  const walker = document.createTreeWalker(
    nodeElement,
    NodeFilter.SHOW_TEXT,
    null,
  );

  let currentChildIndex = 0;
  let currentChildOffset = 0;
  let textNode = walker.nextNode();

  while (textNode) {
    if (textNode === targetContainer) {
      return {
        nodeId,
        childIndex: currentChildIndex,
        offset: currentChildOffset + targetOffset,
      };
    }

    // Move to next child if we've consumed all text from current child
    const node = nodes.find((n) => n.id === nodeId);
    if (node && currentChildIndex < node.children.length) {
      const currentChild = node.children[currentChildIndex]!;
      if (
        currentChildOffset + textNode.textContent!.length >=
        currentChild.text.length
      ) {
        currentChildIndex++;
        currentChildOffset = 0;
      } else {
        currentChildOffset += textNode.textContent!.length;
      }
    }

    textNode = walker.nextNode();
  }

  return { nodeId, childIndex: 0, offset: 0 };
}

export function setCaretPosition(nodes: EditorNode[], position: CaretPosition) {
  const nodeElement = document.querySelector(
    `[data-node-id="${position.nodeId}"]`,
  );
  if (!nodeElement) return;

  const node = nodes.find((n) => n.id === position.nodeId);
  if (!node) return;

  // Find the text node that contains our target position
  let targetTextNode: Text | null = null;

  const walker = document.createTreeWalker(
    nodeElement,
    NodeFilter.SHOW_TEXT,
    null,
  );

  let textNode = walker.nextNode() as Text;
  let childIndex = 0;

  while (textNode && childIndex < node.children.length) {
    if (position.childIndex === childIndex) {
      targetTextNode = textNode;
      break;
    }

    childIndex++;
    textNode = walker.nextNode() as Text;
  }

  if (targetTextNode) {
    const range = document.createRange();
    range.setStart(
      targetTextNode,
      Math.min(position.offset, targetTextNode.textContent?.length ?? 0),
    );
    range.collapse(true);

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
}

export function addCharacter(
  node: EditorNode,
  position: CaretPosition,
  char: string,
) {
  const { childIndex, offset } = position;
  if (node.children.length === 0) {
    return {
      ...node,
      children: [{ type: "text" as const, text: char }],
    };
  }

  const newChildren = [...node.children];
  const currentChild = newChildren[childIndex]!;

  const newText =
    currentChild.text.slice(0, offset) + char + currentChild.text.slice(offset);
  newChildren[childIndex] = { ...currentChild, text: newText };
  return { ...node, children: newChildren };
}

export function deleteCharacter(node: EditorNode, position: CaretPosition) {
  const { childIndex, offset } = position;

  const newChildren = [...node.children];
  const currentChild = newChildren[childIndex]!;
  const newText =
    currentChild.text.slice(0, offset - 1) + currentChild.text.slice(offset);
  newChildren[childIndex] = { ...currentChild, text: newText };
  return { ...node, children: newChildren };
}

export function mergeNodes(firstNode: EditorNode, secondNode: EditorNode) {
  return {
    ...firstNode,
    children: [...firstNode.children, ...secondNode.children],
  };
}
