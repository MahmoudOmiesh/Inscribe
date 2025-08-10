import { adjustMarks } from "../model/marks";
import type { ActiveMarkDescriptor, EditorNode } from "../model/schema";
import type { EditorState } from "../state/editor-state";
import type { Step } from "../state/transaction";
import { deleteBetween, findNodeIndex, replaceNodeAtIndex } from "./shared";

export function insertTextStep(text: string): Step {
  return (state: EditorState) => {
    const { nodes, nodeIdIndex, selection, typingMarks } = state;
    const base = selection.isCollapsed
      ? nodes
      : deleteBetween(nodes, nodeIdIndex, selection);
    const nodeIndex = findNodeIndex(nodeIdIndex, selection.start.nodeId);
    if (nodeIndex === -1) return state;

    const node = base[nodeIndex]!;
    const newNode = insertTextIntoNode(
      node,
      typingMarks,
      selection.start.offset,
      text,
    );

    const updatedNodes = replaceNodeAtIndex(base, nodeIndex, newNode);
    const caret = {
      ...selection.start,
      offset: selection.start.offset + text.length,
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

function insertTextIntoNode(
  node: EditorNode,
  typingMarks: ActiveMarkDescriptor[],
  offset: number,
  text: string,
) {
  const newText = node.text.slice(0, offset) + text + node.text.slice(offset);
  const newMarks = adjustMarks(node.marks, {
    offset,
    deletedLength: 0,
    insertedLength: text.length,
  });
  const newMarksFromActive = typingMarks.map((mark) => ({
    ...mark,
    start: offset,
    end: offset + text.length,
  }));

  return {
    ...node,
    text: newText,
    marks: [...newMarks, ...newMarksFromActive],
  };
}
