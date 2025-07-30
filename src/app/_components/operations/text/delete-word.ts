import type {
  DeleteWordBackwardOperation,
  DeleteWordForwardOperation,
  EditorNode,
} from "../../utils/types";
import { deleteBetween } from "../shared/delete-between";
import { findNodeIndexById } from "../shared/node-operations";

//TODO: browser support isn't great for this, we need to use a polyfill
const wordSegmenter = new Intl.Segmenter("en", { granularity: "word" });

export function deleteWord(
  nodes: EditorNode[],
  operation: DeleteWordBackwardOperation | DeleteWordForwardOperation,
) {
  const { range } = operation;

  if (!range.isCollapsed) {
    return {
      nodes: deleteBetween(nodes, range),
      newCaretPosition: {
        nodeId: range.start.nodeId,
        offset: range.start.offset,
      },
    };
  }

  const nodeIndex = findNodeIndexById(nodes, range.start.nodeId);
  if (nodeIndex === -1) return { nodes, newCaretPosition: null };

  const direction =
    operation.type === "deleteWordBackward" ? "backward" : "forward";
  const node = nodes[nodeIndex]!;

  const currentPosition = range.start.offset;
  const targetPosition = findWordBoundary(
    node.text,
    currentPosition,
    direction,
  );

  const deleteRange = getDeleteRange(
    node,
    currentPosition,
    targetPosition,
    direction,
  );

  return {
    nodes: deleteBetween(nodes, deleteRange),
    newCaretPosition: {
      nodeId: node.id,
      offset: deleteRange.start.offset,
    },
  };
}

function findWordBoundary(
  text: string,
  offset: number,
  direction: "backward" | "forward",
) {
  const segments = Array.from(wordSegmenter.segment(text));

  if (direction === "backward") {
    for (let i = segments.length - 1; i >= 0; i--) {
      const segment = segments[i]!;

      // we are at the start of the word
      // go to previous word
      if (segment.index === offset) {
        const prevSegment = segments[i - 1];
        return prevSegment ? prevSegment.index : 0;
      }

      // we are at the middle or end of the word
      // go to the start of the word
      if (
        segment.index < offset &&
        segment.index + segment.segment.length >= offset
      ) {
        return segment.index;
      }
    }

    return 0;
  } else {
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]!;
      const segmentEnd = segment.index + segment.segment.length;

      // we are at the end of the word
      // go to the end of the next word
      if (segmentEnd === offset) {
        const nextSegment = segments[i + 1];
        return nextSegment
          ? nextSegment.index + nextSegment.segment.length
          : text.length;
      }

      // we are at the middle or beginning of the word
      // go to the end of the word
      if (segment.index <= offset && segmentEnd > offset) {
        return segmentEnd;
      }
    }

    return text.length;
  }
}

function getDeleteRange(
  node: EditorNode,
  currentPosition: number,
  targetPosition: number,
  direction: "backward" | "forward",
) {
  const start = direction === "backward" ? targetPosition : currentPosition;
  const end = direction === "backward" ? currentPosition : targetPosition;

  return {
    start: { nodeId: node.id, offset: start },
    end: { nodeId: node.id, offset: end },
    isCollapsed: false,
  };
}
