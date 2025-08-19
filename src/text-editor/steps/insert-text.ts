import { adjustMarks, isSameMarkDescriptor, splitMarkAt } from "../model/marks";
import type { ActiveMarkDescriptor, EditorNode, Mark } from "../model/schema";
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
  const marksAfterSplit = splitMarksNotInTypingAtOffset(
    node.marks,
    typingMarks,
    offset,
  );

  const newText = node.text.slice(0, offset) + text + node.text.slice(offset);
  const newMarks = adjustMarks(marksAfterSplit, {
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

function splitMarksNotInTypingAtOffset(
  marks: Mark[],
  typing: ActiveMarkDescriptor[],
  offset: number,
) {
  let result = marks;
  for (const m of marks) {
    const spansCaret = m.start < offset && m.end > offset;
    if (spansCaret && !typing.some((t) => isSameMarkDescriptor(t, m))) {
      const desc: ActiveMarkDescriptor =
        m.type === "highlight"
          ? { type: "highlight", color: m.color }
          : { type: m.type };
      result = splitMarkAt(result, desc, offset);
    }
  }
  return result;
}
