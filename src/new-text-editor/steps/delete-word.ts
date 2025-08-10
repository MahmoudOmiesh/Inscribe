import type { EditorNode } from "../model/schema";
import type { EditorState } from "../state/editor-state";
import type { Step } from "../state/transaction";
import { deleteBetween, findNodeIndex } from "./shared";

const wordSegmenter = new Intl.Segmenter("en", { granularity: "word" });

export function deleteWordStep(direction: "backward" | "forward"): Step {
  return (state: EditorState) => {
    const { nodes, nodeIdIndex, selection } = state;

    if (!selection.isCollapsed) {
      const updatedNodes = deleteBetween(nodes, nodeIdIndex, selection);
      const caret = { ...selection.start };
      return {
        ...state,
        nodes: updatedNodes,
        selection: {
          start: caret,
          end: caret,
          isCollapsed: true,
        },
      };
    }

    const nodeIndex = findNodeIndex(nodeIdIndex, selection.start.nodeId);
    if (nodeIndex === -1) return state;

    const node = nodes[nodeIndex]!;

    const currentPosition = selection.start.offset;
    const targetPosition = findWordBoundary(
      node.text,
      currentPosition,
      direction,
    );
    const deleteRange = getDeleteRange(node, currentPosition, targetPosition);

    const updatedNodes = deleteBetween(nodes, nodeIdIndex, deleteRange);
    const caret = {
      ...selection.start,
      offset: deleteRange.start.offset,
    };

    return {
      ...state,
      nodes: updatedNodes,
      selection: {
        start: caret,
        end: caret,
        isCollapsed: true,
      },
    };
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
) {
  return {
    start: {
      nodeId: node.id,
      offset: Math.min(currentPosition, targetPosition),
    },
    end: {
      nodeId: node.id,
      offset: Math.max(currentPosition, targetPosition),
    },
    isCollapsed: false,
  };
}
