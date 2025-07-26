import type {
  EditorNode,
  Mark,
  SelectionRange,
  ToggleMarkOperation,
} from "../utils/types";
import { mergeOverlappingMarks } from "./helpers/merge-marks";

export function toggleMark(
  nodes: EditorNode[],
  activeMarks: Mark["type"][],
  operation: ToggleMarkOperation,
) {
  const { range, markType } = operation;
  const shouldAddMark = !activeMarks.includes(markType);

  if (range.isCollapsed) {
    return toggleMarkAtCursor(nodes, range, markType, shouldAddMark);
  }

  return toggleMarkAtRange(nodes, range, markType, shouldAddMark);
}

function toggleMarkAtRange(
  nodes: EditorNode[],
  range: SelectionRange,
  markType: Mark["type"],
  shouldAddMark: boolean,
) {
  const startNodeIndex = nodes.findIndex((n) => n.id === range.start.nodeId);
  const endNodeIndex = nodes.findIndex((n) => n.id === range.end.nodeId);

  if (startNodeIndex === -1 || endNodeIndex === -1)
    return { nodes, newCaretPosition: null };

  if (startNodeIndex === endNodeIndex) {
    return toggleMarkAtSingleNode(nodes, range, markType, shouldAddMark);
  }

  return toggleMarkAtMultipleNodes(nodes, range, markType, shouldAddMark);
}

function toggleMarkAtSingleNode(
  nodes: EditorNode[],
  range: SelectionRange,
  markType: Mark["type"],
  shouldAddMark: boolean,
) {
  const nodeIndex = nodes.findIndex((n) => n.id === range.start.nodeId);
  if (nodeIndex === -1) return { nodes, newCaretPosition: null };

  const node = nodes[nodeIndex]!;
  let newMarks = [...node.marks];

  if (shouldAddMark) {
    const newMark = {
      type: markType,
      start: range.start.offset,
      end: range.end.offset,
    };

    newMarks = mergeOverlappingMarks([...newMarks, newMark]);
  } else {
    newMarks = removeMarkFromRange(
      newMarks,
      markType,
      range.start.offset,
      range.end.offset,
    );
  }

  const newNodes = [
    ...nodes.slice(0, nodeIndex),
    { ...node, marks: newMarks },
    ...nodes.slice(nodeIndex + 1),
  ];

  return { nodes: newNodes, newCaretPosition: range };
}

function removeMarkFromRange(
  marks: Mark[],
  markType: Mark["type"],
  rangeStart: number,
  rangeEnd: number,
) {
  const newMarks: Mark[] = [];

  for (const mark of marks) {
    if (mark.type !== markType) {
      newMarks.push(mark);
      continue;
    }

    // Mark is outside of the range
    if (mark.start >= rangeEnd || mark.end <= rangeStart) {
      newMarks.push(mark);
      continue;
    }

    // Mark is completely inside of the range
    if (mark.start >= rangeStart && mark.end <= rangeEnd) {
      continue;
    }

    // Mark extends before the range
    if (mark.start < rangeStart && mark.end > rangeStart) {
      newMarks.push({
        ...mark,
        end: rangeStart,
      });
    }

    // Mark extends after the range
    if (mark.start < rangeEnd && mark.end > rangeEnd) {
      newMarks.push({
        ...mark,
        start: rangeEnd,
      });
    }
  }

  return newMarks;
}

function toggleMarkAtMultipleNodes(
  nodes: EditorNode[],
  range: SelectionRange,
  markType: Mark["type"],
  shouldAddMark: boolean,
) {
  const startNodeIndex = nodes.findIndex((n) => n.id === range.start.nodeId);
  const endNodeIndex = nodes.findIndex((n) => n.id === range.end.nodeId);

  if (startNodeIndex === -1 || endNodeIndex === -1)
    return { nodes, newCaretPosition: null };

  const newNodes = [...nodes];

  for (let i = startNodeIndex; i <= endNodeIndex; i++) {
    const node = newNodes[i]!;
    let newMarks = [...node.marks];

    const startOffset = i === startNodeIndex ? range.start.offset : 0;
    const endOffset = i === endNodeIndex ? range.end.offset : node.text.length;

    if (shouldAddMark) {
      const newMark = {
        type: markType,
        start: startOffset,
        end: endOffset,
      };

      newMarks = mergeOverlappingMarks([...newMarks, newMark]);
    } else {
      newMarks = removeMarkFromRange(
        newMarks,
        markType,
        startOffset,
        endOffset,
      );
    }

    newNodes[i] = { ...node, marks: newMarks };
  }

  return { nodes: newNodes, newCaretPosition: range };
}
function toggleMarkAtCursor(
  nodes: EditorNode[],
  range: SelectionRange,
  markType: Mark["type"],
  shouldAddMark: boolean,
) {
  if (shouldAddMark) {
    // don't do anything
    // the mark will be applied automatically
    // during the next insert operation
    return { nodes, newCaretPosition: range.start };
  }

  const nodeIndex = nodes.findIndex((n) => n.id === range.start.nodeId);
  if (nodeIndex === -1) return { nodes, newCaretPosition: null };

  const node = nodes[nodeIndex]!;
  const splitOffset = range.start.offset;
  const newMarks = splitMarkAtPosition(node.marks, markType, splitOffset);

  const newNodes = [
    ...nodes.slice(0, nodeIndex),
    {
      ...node,
      marks: newMarks,
    },
    ...nodes.slice(nodeIndex + 1),
  ];

  return { nodes: newNodes, newCaretPosition: range.start };
}

function splitMarkAtPosition(
  marks: Mark[],
  markType: Mark["type"],
  position: number,
) {
  const newMarks = [];
  for (const mark of marks) {
    if (mark.type !== markType) {
      newMarks.push(mark);
      continue;
    }

    if (position <= mark.start || position >= mark.end) {
      newMarks.push(mark);
      continue;
    }

    const leftMark = {
      ...mark,
      end: position,
    };

    const rightMark = {
      ...mark,
      start: position,
    };

    newMarks.push(leftMark, rightMark);
  }

  return newMarks;
}
