import { useCallback, useEffect, useRef, useState } from "react";
import type {
  PendingCaretPosition,
  EditorNode,
  Mark,
  SelectionRange,
} from "../utils/types";
import {
  compareSelectionRanges,
  getSelectionRange,
  setSelectionRange,
} from "../utils/range";

export function useEditor(initialNodes: EditorNode[]) {
  const [nodes, setNodes] = useState(initialNodes);
  const [activeMarks, setActiveMarks] = useState<Mark["type"][]>([]);

  const editorRef = useRef<HTMLDivElement>(null);
  const previousSelectionRangeRef = useRef<SelectionRange | null>(null);
  const pendingCaretPositionRef = useRef<PendingCaretPosition | null>(null);

  const getActiveMarks = useCallback(() => {
    const range = getSelectionRange();
    if (!range) return;

    if (range.start.nodeId === range.end.nodeId) {
      const node = nodes.find((n) => n.id === range.start.nodeId);
      if (!node) return;

      const marks = node.marks.filter(
        (m) =>
          m.start <= range.start.offset - Number(range.isCollapsed) &&
          m.end >= range.end.offset,
      );

      return marks.map((m) => m.type);
    }

    const firstNodeIdx = nodes.findIndex((n) => n.id === range.start.nodeId);
    const lastNodeIdx = nodes.findIndex((n) => n.id === range.end.nodeId);
    if (firstNodeIdx === -1 || lastNodeIdx === -1) return;

    const firstNode = nodes[firstNodeIdx]!;
    const lastNode = nodes[lastNodeIdx]!;

    const firstNodeMarks = firstNode.marks.filter(
      (m) => m.start <= range.start.offset && m.end === firstNode.text.length,
    );
    const middleMarks = nodes
      .slice(firstNodeIdx + 1, lastNodeIdx)
      .flatMap((n) =>
        n.marks.filter((m) => m.start === 0 && m.end === n.text.length),
      );
    const lastNodeMarks = lastNode.marks.filter(
      (m) => m.start === 0 && m.end >= range.end.offset,
    );

    const commonMarks = firstNodeMarks.filter((m) => {
      const doesMiddleExist = lastNodeIdx - firstNodeIdx > 1;
      return (
        (doesMiddleExist
          ? middleMarks.some((m2) => m.type === m2.type)
          : true) && lastNodeMarks.some((m2) => m.type === m2.type)
      );
    });

    return commonMarks.map((m) => m.type);
  }, [nodes]);

  const handleSelect = useCallback(() => {
    const currentSelectionRange = getSelectionRange();
    const previousSelectionRange = previousSelectionRangeRef.current;

    if (compareSelectionRanges(currentSelectionRange, previousSelectionRange))
      return;

    const activeMarks = getActiveMarks();
    previousSelectionRangeRef.current = currentSelectionRange;
    setActiveMarks(activeMarks ?? []);
  }, [getActiveMarks]);

  const setPendingCaretPosition = useCallback(
    (position: PendingCaretPosition) => {
      pendingCaretPositionRef.current = position;
    },
    [],
  );

  useEffect(() => {
    const position = pendingCaretPositionRef.current;
    if (!position) return;

    setSelectionRange(position);
    pendingCaretPositionRef.current = null;
  }, [nodes]);

  return {
    nodes,
    setNodes,
    activeMarks,
    setActiveMarks,
    setPendingCaretPosition,
    handleSelect,
    ref: editorRef,
  };
}
