import { useCallback, useEffect, useRef, useState } from "react";
import type {
  PendingCaretPosition,
  CaretPosition,
  EditorNode,
  Mark,
  SelectionRange,
} from "../utils/types";
import { getSelectionRange, setSelectionRange } from "../utils/range";

export function useEditor(initialNodes: EditorNode[]) {
  const [nodes, setNodes] = useState(initialNodes);
  const [activeMarks, setActiveMarks] = useState<Mark["type"][]>([]);
  const [activeNodeType, setActiveNodeType] = useState<
    EditorNode["type"] | null
  >(null);
  const [activeNodeAlignment, setActiveNodeAlignment] = useState<
    EditorNode["alignment"] | null
  >(null);

  const editorRef = useRef<HTMLDivElement>(null);
  const pendingCaretPositionRef = useRef<PendingCaretPosition | null>(null);
  const preserveActiveMarksAtPositionRef = useRef<CaretPosition | null>(null);

  const getActiveMarks = useCallback(
    (range: SelectionRange) => {
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
    },
    [nodes],
  );

  const getActiveNodeType = useCallback(
    (range: SelectionRange) => {
      const firstNodeIdx = nodes.findIndex((n) => n.id === range.start.nodeId);
      const lastNodeIdx = nodes.findIndex((n) => n.id === range.end.nodeId);
      if (firstNodeIdx === -1 || lastNodeIdx === -1) return null;

      const firstNode = nodes[firstNodeIdx]!;

      const type = firstNode.type;
      for (let i = firstNodeIdx + 1; i <= lastNodeIdx; i++) {
        const node = nodes[i]!;
        if (node.type !== type) return null;
      }

      return type;
    },
    [nodes],
  );

  const getActiveNodeAlignment = useCallback(
    (range: SelectionRange) => {
      const firstNodeIdx = nodes.findIndex((n) => n.id === range.start.nodeId);
      const lastNodeIdx = nodes.findIndex((n) => n.id === range.end.nodeId);
      if (firstNodeIdx === -1 || lastNodeIdx === -1) return null;

      const firstNode = nodes[firstNodeIdx]!;

      const alignment = firstNode.alignment;
      for (let i = firstNodeIdx + 1; i <= lastNodeIdx; i++) {
        const node = nodes[i]!;
        if (node.alignment !== alignment) return null;
      }

      return alignment;
    },
    [nodes],
  );

  const handleSelect = useCallback(() => {
    const currentSelectionRange = getSelectionRange();

    if (!currentSelectionRange) return;

    const activeNodeType = getActiveNodeType(currentSelectionRange);
    setActiveNodeType(activeNodeType);

    const activeNodeAlignment = getActiveNodeAlignment(currentSelectionRange);
    setActiveNodeAlignment(activeNodeAlignment);

    const preservePosition = preserveActiveMarksAtPositionRef.current;
    const shouldPreserveActiveMarks =
      currentSelectionRange.isCollapsed &&
      preservePosition &&
      preservePosition.nodeId === currentSelectionRange.start.nodeId &&
      preservePosition.offset === currentSelectionRange.start.offset;

    if (shouldPreserveActiveMarks) {
      return;
    }

    const activeMarks = getActiveMarks(currentSelectionRange);
    setActiveMarks(activeMarks ?? []);
    preserveActiveMarksAtPositionRef.current = null;
  }, [getActiveMarks, getActiveNodeType, getActiveNodeAlignment]);

  const setPendingCaretPosition = useCallback(
    (position: PendingCaretPosition) => {
      pendingCaretPositionRef.current = position;
    },
    [],
  );

  const preserveActiveMarksAtCurrentPosition = useCallback(() => {
    const range = getSelectionRange();
    if (!range?.isCollapsed) return;

    preserveActiveMarksAtPositionRef.current = range.start;
  }, []);

  useEffect(() => {
    // console.log("NODES", nodes);

    const position = pendingCaretPositionRef.current;
    if (!position) return;

    setSelectionRange(position);
    pendingCaretPositionRef.current = null;

    handleSelect();
  }, [nodes, handleSelect]);

  return {
    nodes,
    setNodes,
    setPendingCaretPosition,

    activeMarks,
    setActiveMarks,
    preserveActiveMarksAtCurrentPosition,

    activeNodeType,
    activeNodeAlignment,

    handleSelect,

    ref: editorRef,
  };
}
