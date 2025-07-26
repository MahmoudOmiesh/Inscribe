import type {
  EditorNode,
  Mark,
  SelectionRange,
  ToggleMarkOperation,
} from "../utils/types";

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

  return {
    nodes,
    newCaretPosition: null,
  };
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
