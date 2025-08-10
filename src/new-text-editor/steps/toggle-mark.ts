import type { EditorState } from "../state/editor-state";
import type { ActiveMarkDescriptor, EditorNode, Mark } from "../model/schema";

import { findNodeIndex, replaceNodeAtIndex } from "./shared";
import type { SelectionRange } from "../model/selection";
import { splitMarkAt } from "../model/marks";
import type { Step } from "../state/transaction";

export function toggleMarkStep(mark: ActiveMarkDescriptor): Step {
  return (state: EditorState) => {
    const { nodes, nodeIdIndex, typingMarks, selection } = state;
    const shouldAddMark = !typingMarks.some((m) => m.type === mark.type);

    if (selection.isCollapsed) {
      const nodeIndex = findNodeIndex(nodeIdIndex, selection.start.nodeId);
      if (nodeIndex === -1) return state;

      const node = nodes[nodeIndex]!;

      if (!shouldAddMark) {
        const newMarks = splitMarkAt(node.marks, mark, selection.start.offset);

        return {
          ...state,
          nodes: replaceNodeAtIndex(nodes, nodeIndex, {
            ...node,
            marks: newMarks,
          }),
        };
      }

      return state;
    }

    const updatedNodes = applyMarkOverRange(
      nodes,
      nodeIdIndex,
      mark,
      selection,
      shouldAddMark,
    );

    return {
      ...state,
      nodes: updatedNodes,
    };
  };
}

function applyMarkOverRange(
  nodes: EditorNode[],
  nodeIdIndex: Map<string, number>,
  mark: ActiveMarkDescriptor,
  selection: SelectionRange,
  shouldAddMark: boolean,
) {
  const startNodeIndex = findNodeIndex(nodeIdIndex, selection.start.nodeId);
  const endNodeIndex = findNodeIndex(nodeIdIndex, selection.end.nodeId);

  if (startNodeIndex === -1 || endNodeIndex === -1) return nodes;

  const updatedNodes = [...nodes];

  for (let i = startNodeIndex; i <= endNodeIndex; i++) {
    const node = nodes[i]!;
    let newMarks = [...node.marks];

    const start = i === startNodeIndex ? selection.start.offset : 0;
    const end = i === endNodeIndex ? selection.end.offset : node.text.length;

    if (shouldAddMark) {
      const newMark = {
        ...mark,
        start,
        end,
      };

      newMarks.push(newMark);
    } else {
      newMarks = removeMarkFromRange(newMarks, mark, start, end);
    }

    updatedNodes[i] = {
      ...node,
      marks: newMarks,
    };
  }

  return updatedNodes;
}

function removeMarkFromRange(
  marks: Mark[],
  markToRemove: ActiveMarkDescriptor,
  rangeStart: number,
  rangeEnd: number,
) {
  const newMarks: Mark[] = [];

  for (const mark of marks) {
    if (mark.type !== markToRemove.type) {
      newMarks.push(mark);
      continue;
    }

    if (
      mark.type === "highlight" &&
      markToRemove.type === "highlight" &&
      mark.color !== markToRemove.color
    ) {
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
