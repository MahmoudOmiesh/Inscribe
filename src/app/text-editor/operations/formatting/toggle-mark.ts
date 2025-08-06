import type {
  EditorNode,
  Mark,
  SelectionRange,
  ToggleMarkOperation,
} from "../../utils/types";
import { mergeOverlappingMarks } from "../shared/merge-marks";
import {
  findNodeIndexById,
  replaceNodeAtIndex,
} from "../shared/node-operations";

export function toggleMark(
  nodes: EditorNode[],
  nodeIdIndexMap: Map<string, number>,
  activeMarks: Mark["type"][],
  operation: ToggleMarkOperation,
) {
  const { range, markType } = operation;
  const shouldAddMark = !activeMarks.includes(markType);

  if (range.isCollapsed) {
    return toggleMarkAtCursor(
      nodes,
      nodeIdIndexMap,
      range,
      markType,
      shouldAddMark,
    );
  }

  return toggleMarkAtRange(
    nodes,
    nodeIdIndexMap,
    range,
    markType,
    shouldAddMark,
  );
}

function toggleMarkAtRange(
  nodes: EditorNode[],
  nodeIdIndexMap: Map<string, number>,
  range: SelectionRange,
  markType: Mark["type"],
  shouldAddMark: boolean,
) {
  const startNodeIndex = findNodeIndexById(nodeIdIndexMap, range.start.nodeId);
  const endNodeIndex = findNodeIndexById(nodeIdIndexMap, range.end.nodeId);

  if (startNodeIndex === -1 || endNodeIndex === -1)
    return { nodes, newCaretPosition: null };

  if (startNodeIndex === endNodeIndex) {
    return toggleMarkAtSingleNode(
      nodes,
      startNodeIndex,
      range,
      markType,
      shouldAddMark,
    );
  }

  return toggleMarkAtMultipleNodes(
    nodes,
    startNodeIndex,
    endNodeIndex,
    range,
    markType,
    shouldAddMark,
  );
}

function toggleMarkAtSingleNode(
  nodes: EditorNode[],
  nodeIndex: number,
  range: SelectionRange,
  markType: Mark["type"],
  shouldAddMark: boolean,
) {
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

  return {
    nodes: replaceNodeAtIndex(nodes, nodeIndex, { ...node, marks: newMarks }),
    newCaretPosition: range,
  };
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
  startNodeIndex: number,
  endNodeIndex: number,
  range: SelectionRange,
  markType: Mark["type"],
  shouldAddMark: boolean,
) {
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
  nodeIdIndexMap: Map<string, number>,
  range: SelectionRange,
  markType: Mark["type"],
  shouldAddMark: boolean,
) {
  if (shouldAddMark) {
    // don't do anything
    // the mark will be applied automatically
    // during the next insert operation

    // returning a new array of nodes
    // is important to trigger a re-render
    // to update the caret position
    return { nodes: [...nodes], newCaretPosition: range.start };
  }

  const nodeIndex = findNodeIndexById(nodeIdIndexMap, range.start.nodeId);
  if (nodeIndex === -1) return { nodes, newCaretPosition: null };

  const node = nodes[nodeIndex]!;
  const splitOffset = range.start.offset;
  const newMarks = splitMarkAtPosition(node.marks, markType, splitOffset);

  return {
    nodes: replaceNodeAtIndex(nodes, nodeIndex, { ...node, marks: newMarks }),
    newCaretPosition: range.start,
  };
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
