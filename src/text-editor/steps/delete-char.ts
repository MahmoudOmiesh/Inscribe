import { adjustMarks } from "../model/marks";
import type { EditorState } from "../state/editor-state";
import type { Step } from "../state/transaction";
import { deleteBetween, findNodeIndex, replaceNodeAtIndex } from "./shared";

const graphemeSegmenter = new Intl.Segmenter("en", { granularity: "grapheme" });

function previousGraphemeBoundary(text: string, offset: number) {
  if (offset <= 0) return 0;

  let prev = 0;
  const segments = graphemeSegmenter.segment(text);
  for (const segment of segments) {
    if (segment.index >= offset) break;
    prev = segment.index;
  }

  return prev;
}

function nextGraphemeBoundary(text: string, offset: number) {
  if (offset >= text.length) return text.length;

  const segments = graphemeSegmenter.segment(text);
  for (const segment of segments) {
    const start = segment.index;
    const end = start + segment.segment.length;
    if (offset >= start && offset < end) return end;
  }

  return text.length;
}

export function deleteCharStep(direction: "backward" | "forward"): Step {
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
    const currentOffset = selection.start.offset;

    const deleteStart =
      direction === "backward"
        ? previousGraphemeBoundary(node.text, currentOffset)
        : currentOffset;

    const deleteEnd =
      direction === "backward"
        ? currentOffset
        : nextGraphemeBoundary(node.text, currentOffset);

    if (deleteStart === deleteEnd) return state;

    const deletedLength = deleteEnd - deleteStart;
    const newText =
      node.text.slice(0, deleteStart) + node.text.slice(deleteEnd);
    const newMarks = adjustMarks(node.marks, {
      offset: deleteStart,
      deletedLength,
      insertedLength: 0,
    });

    const newNode = {
      ...node,
      text: newText,
      marks: newMarks,
    };

    const updatedNodes = replaceNodeAtIndex(nodes, nodeIndex, newNode);

    const newOffset = direction === "backward" ? deleteStart : currentOffset;
    const caret = {
      ...selection.start,
      offset: newOffset,
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
