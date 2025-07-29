import { v4 as uuidv4 } from "uuid";
import type { PasteTextOperation } from "../utils/types";
import type { EditorNode, Mark } from "../utils/types";
import { insertText } from "./insert-text";
import { mergeOverlappingMarks } from "./helpers/merge-marks";
import { splitNode } from "./helpers/split-node";
import { mergeNodes } from "./helpers/marge-nodes";
import { deleteBetween } from "./helpers/delete-between";

function htmlToEditorNodes(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const nodes: EditorNode[] = [];

  for (const child of doc.body.children) {
    const nodeType = getNodeType(child);
    const { text, marks } = getTextAndMarks(child);
    nodes.push({
      id: uuidv4(),
      type: nodeType,
      text,
      marks,
    });
  }

  return nodes;
}

export function pasteText(
  nodes: EditorNode[],
  activeMarks: Mark["type"][],
  operation: PasteTextOperation,
) {
  const { content, contentType, range } = operation;

  if (contentType === "plain") {
    return insertText(nodes, activeMarks, {
      type: "insertText",
      text: operation.content,
      range: operation.range,
    });
  }

  nodes = range.isCollapsed ? nodes : deleteBetween(nodes, range);
  const newNodes = htmlToEditorNodes(content);

  const nodeIndex = nodes.findIndex((n) => n.id === range.start.nodeId);
  if (nodeIndex === -1) return { nodes, newCaretPosition: null };

  const node = nodes[nodeIndex]!;
  const isNodeEmpty = node.text.length === 0;

  if (isNodeEmpty) {
    // if we are in an empty node, replace it with the new nodes
    return {
      nodes: [
        ...nodes.slice(0, nodeIndex),
        ...newNodes,
        ...nodes.slice(nodeIndex + 1),
      ],
      newCaretPosition: {
        nodeId: newNodes[newNodes.length - 1]!.id,
        offset: newNodes[newNodes.length - 1]!.text.length,
      },
    };
  } else {
    if (newNodes.length === 1) {
      // if we are pasting a single node, we just insert it
      return insertText(nodes, activeMarks, {
        type: "insertText",
        text: newNodes[0]!.text,
        range,
      });
    }

    // we split the current node into two
    // merge the first part with the first new node
    // merge the second part with the last new node
    // insert the middle part

    const [left, right] = splitNode({
      node,
      offset: range.start.offset,
      newNodeId: uuidv4(),
    });

    const firstPart =
      left.text.length === 0 ? newNodes[0]! : mergeNodes(left, newNodes[0]!);
    const lastPart =
      right.text.length === 0
        ? newNodes[newNodes.length - 1]!
        : mergeNodes(right, newNodes[newNodes.length - 1]!);

    return {
      nodes: [
        ...nodes.slice(0, nodeIndex),
        firstPart,
        ...newNodes.slice(1, -1),
        lastPart,
        ...nodes.slice(nodeIndex + 1),
      ],
      newCaretPosition: {
        nodeId: lastPart.id,
        offset: lastPart.text.length,
      },
    };
  }
}

function getNodeType(node: Node): EditorNode["type"] {
  const name = node.nodeName.toLowerCase();
  if (name === "h1") return "heading-1";
  if (name === "h2") return "heading-2";
  if (name === "h3") return "heading-3";
  if (name === "h4") return "heading-4";
  return "paragraph";
}

function getMarkType(node: Node): Mark["type"] | null {
  const name = node.nodeName.toLowerCase();
  if (name === "strong" || name === "b") return "bold";
  if (name === "em" || name === "i") return "italic";
  if (name === "u") return "underline";
  if (name === "s") return "strikethrough";
  if (name === "sup") return "superscript";
  if (name === "sub") return "subscript";
  if (name === "mark") {
    // figure out the color
    return "highlight-yellow";
  }

  return null;
}

function getTextAndMarks(node: Node): { text: string; marks: Mark[] } {
  const marks: Mark[] = [];

  let textContent = "";
  let currentOffset = 0;

  //stack of marks that are currently active
  const markStack: Omit<Mark, "end">[] = [];

  function processNode(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";
      textContent += text;
      currentOffset += text.length;
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const markType = getMarkType(node);

      if (markType) {
        markStack.push({
          type: markType,
          start: currentOffset,
        });
      }

      for (const child of node.childNodes) {
        processNode(child);
      }

      if (markType) {
        const mark = markStack.pop();
        if (mark && mark.start < currentOffset) {
          marks.push({
            ...mark,
            end: currentOffset,
          });
        }
      }
    }
  }

  processNode(node);
  return { text: textContent, marks: mergeOverlappingMarks(marks) };
}
